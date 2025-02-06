"use client";

import { useState, useEffect, useCallback } from "react";
import { Connection, PublicKey } from "@solana/web3.js";
import { useWallet } from "@/hooks/useWallet";
import { Button } from "@/components/ui/moving-border";
import { Card } from "@/components/ui/card";
import { MetricsCard } from "@/components/metrics-card";
// import { VaultTable } from "@/components/vault-table";
import { StatsChart } from "@/components/stats-chart";
import { useRouter } from "next/navigation";
import { MultiStepLoader as Loader} from "@/components/ui/multi-step-loader";

const SOLANA_MAINNET_URL =
    "https://tiniest-broken-lake.solana-mainnet.quiknode.pro/c5462950ebb302a25357758b0160085153b91d73/";
const connection = new Connection(SOLANA_MAINNET_URL, "confirmed");

interface Token {
  tokenMint: string;
  agentName: string;  // Make it optional with ?
  balance: number;
  price: number | null;
  marketCap: number | null;
  priceDeltaPercent?: number;
  liquidity?: number | null;
  volume24Hours?: number | null;
  holdersCount?: number | null;
}

export default function Page() {
  const { walletAddress } = useWallet();
  const [balances, setBalances] = useState<Token[]>([]);
  const [historicalData, setHistoricalData] = useState<never[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<string | null>(null);
  const router = useRouter();

  const loadingStates = [
    {
      text: "🔍 Connecting to wallet...",
    },
    {
      text: "💰 Verifying wallet...",
    },
    {
      text: "🪙 Loading token balances...",
    },
    {
      text: "✨ Enriching token data...",
    },
  ];

  // Fetch SOL Balance
  const fetchSolBalance = useCallback(async () => {
    try {
      if (!walletAddress) return 0;
      const walletPublicKey = new PublicKey(walletAddress);
      const solBalance = await connection.getBalance(walletPublicKey);
      console.log("✅ SOL Balance:", solBalance / 1e9);
      return solBalance / 1e9; // Convert lamports to SOL
    } catch (error) {
      console.error("❌ Error fetching SOL balance:", error);
      return 0;
    }
  }, [walletAddress]);

  // Fetch SPL Token Balances + Enrich Data
  const fetchAllTokenBalances = useCallback(async () => {
    setLoading(true);
    setErrors(null);
    setBalances([]);

    try {
      if (!walletAddress) {
        setErrors("Wallet not connected.");
        console.log(errors)
        setLoading(false);
        return;
      }

      const walletPublicKey = new PublicKey(walletAddress);

      // Fetch SOL Balance
      const solBalance = await fetchSolBalance();

      // Fetch SPL Token Accounts
      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(walletPublicKey, {
        programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
      });

      const tokenList = tokenAccounts.value
          .map((accountInfo) => {
            const mintAddress = accountInfo.account.data.parsed.info.mint;
            const amount = accountInfo.account.data.parsed.info.tokenAmount.uiAmount || 0;
            return {
              tokenMint: mintAddress,
              balance: amount,
              price: null,
              marketCap: null,
            } as Token;  // Cast to Token type
          })
          .filter((token) => token.balance > 0);

      // Add SOL manually to the token list

      tokenList.unshift({
        tokenMint: "So11111111111111111111111111111111111111112",
        agentName: "SOL",
        balance: solBalance,
        price: null,
        marketCap: null,
      } as Token);

      // Enrich SPL Tokens
      const enrichedTokens = await Promise.all(
          tokenList.map(async (token) => {
            if (token.tokenMint === "So11111111111111111111111111111111111111112") {
              try {
                const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd");
                const data = await response.json();
                const solPrice = data.solana.usd;
                return { ...token, price: solPrice, marketCap: null };
              } catch (error) {
                console.error("❌ Error fetching SOL market price:", error);
                return token;
              }
            } else {
              try {
                const apiUrl = `/api/fetchTokenData?contractAddress=${token.tokenMint}`;
                const response = await fetch(apiUrl);
                const result = await response.json();

                if (result.success && result.data) {
                  return {
                    ...token,
                    agentName: result.data.ok.agentName || "Unknown",
                    price: result.data.ok.price || null,
                    marketCap: result.data.ok.marketCap || null,
                    priceDeltaPercent: result.data.ok.priceDeltaPercent || 0,
                    liquidity: result.data.ok.liquidity || null,
                    volume24Hours: result.data.ok.volume24Hours || null,
                    holdersCount: result.data.ok.holdersCount || null,
                  };
                }
              } catch (err) {
                console.error(`❌ Error fetching data for ${token.tokenMint}:`, err);
              }
            }
            return token;
          })
      );

      console.log("✅ Final Token List:", enrichedTokens);
      setBalances(enrichedTokens);
    } catch (err) {
      console.error("❌ Error fetching token balances:", err);
      setErrors("Failed to fetch token balances.");
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  }, [walletAddress, fetchSolBalance, errors]);

  const fetchTransactionHistory = useCallback(async () => {
    if (!walletAddress) return;

    setHistoricalData([]);

    try {
      const walletPublicKey = new PublicKey(walletAddress);
      const signatures = await connection.getSignaturesForAddress(walletPublicKey, { limit: 20 });

      let balanceTracker = 0;
      const balanceMap = new Map();

      for (const sig of signatures) {
        const tx = await connection.getTransaction(sig.signature, {
          commitment: "confirmed",
          maxSupportedTransactionVersion: 0,
        });

        if (tx) {
          const blockTime = tx.blockTime ? new Date(tx.blockTime * 1000) : new Date();
          const formattedDate = blockTime.toISOString().split("T")[0];

          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          const amount = (tx.meta?.preBalances[0] - tx.meta?.postBalances[0]) / 1e9 || 0;
          balanceTracker += amount;

          balanceMap.set(formattedDate, {
            date: formattedDate,
            value: balanceTracker.toFixed(4),
          });
        }
      }

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      setHistoricalData(Array.from(balanceMap.values()).reverse());
    } catch (err) {
      console.error("❌ Error fetching transaction history:", err);
    } finally {
      setLoading(false);
    }
  }, [walletAddress]);

  useEffect(() => {
    if (!walletAddress) return;

    const fetchData = async () => {
      await fetchAllTokenBalances();
      await fetchTransactionHistory();
    };

    fetchData();
  }, [fetchAllTokenBalances, fetchTransactionHistory, walletAddress]);

  const handleNavigation = () => {
    router.push("/walletTransaction");
  };

  const tokensWithAgentNames = balances
      .filter((token) => token.agentName) // Ensure `agentName` exists
      .map((token) => ({
        ...token,
        agentName: token.agentName || "Unknown",
        price: token.price ?? 0, // ✅ Ensure price is always a number
        marketCap: token.marketCap ?? 0, // ✅ Ensure marketCap is always a number
        priceDeltaPercent: token.priceDeltaPercent ?? 0,
        liquidity: token.liquidity ?? 0,
        volume24Hours: token.volume24Hours ?? 0,
        holdersCount: token.holdersCount ?? 0
      }));


  return (
      <div className="min-h-screen bg-black text-white">
        <main className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold">Overview</h1>
            </div>
            <div>
            <Button
              onClick={() => handleNavigation()}
              borderRadius="1rem"
              className="bg-slate-900 text-white border-slate-800"
              borderClassName=" border border-2 border-slate-800"
            >
              Transactions
            </Button>
    </div>

          </div>
          <Loader
            loadingStates={loadingStates}
            loading={loading}
            duration={1000}
            loop={false}
          />

          <div className="grid gap-4 md:grid-cols-3">
            <MetricsCard title="Your Balance" tokens={tokensWithAgentNames} />
            {balances.length > 0 && <MetricsCard title="Top Holdings" tokens={tokensWithAgentNames.slice(0, 3)} />}
          </div>
          {historicalData.length > 0 ? (
              <Card className="mt-6 p-6 bg-black border-neutral-500">
                <StatsChart data={historicalData} />
              </Card>
          ) : (
              <div className="flex flex-col justify-center items-center h-40">
                <div className="w-10 h-10 border-4 border-gray-300 border-t-yellow-500 rounded-full animate-spin"></div>
                <p className="pt-4">Loading...</p>
              </div>
          )}


          {/*<Card className="mt-6 p-6 bg-black border-neutral-500">*/}
          {/*  <VaultTable tokens={tokensWithAgentNames} />*/}
          {/*</Card>*/}
        </main>
      </div>
  );
}
