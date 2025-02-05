
"use client";

import { useState, useEffect } from "react";
import { Connection, PublicKey } from "@solana/web3.js";
import { useWallet } from "@/hooks/useWallet";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MetricsCard } from "@/components/metrics-card";
import { VaultTable } from "@/components/vault-table";
import { StatsChart } from "@/components/stats-chart";

const SOLANA_MAINNET_URL =
    "https://tiniest-broken-lake.solana-mainnet.quiknode.pro/c5462950ebb302a25357758b0160085153b91d73/";
const connection = new Connection(SOLANA_MAINNET_URL, "confirmed");

export default function Page() {
  const { walletAddress, connectWallet, disconnectWallet } = useWallet();
  const [balances, setBalances] = useState<
      { tokenMint: string; agentName: string; balance: number; price: number | null; marketCap: number | null }[]
  >([]);
  const [historicalData, setHistoricalData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState("Last month");
  const [errors, setErrors] = useState<string | null>(null);

  useEffect(() => {
    if (walletAddress) {
      fetchAllTokenBalances();
      fetchTransactionHistory();
    }
  }, [walletAddress]);

  const fetchAllTokenBalances = async () => {
    setLoading(true);
    setErrors(null);
    setBalances([]);

    try {
      if (!walletAddress) {
        setErrors("Wallet not connected.");
        setLoading(false);
        return;
      }

      const walletPublicKey = new PublicKey(walletAddress);

      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
          walletPublicKey,
          { programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA") }
      );

      if (tokenAccounts.value.length === 0) {
        setErrors("No tokens found in this wallet.");
        setLoading(false);
        return;
      }

      const tokenList = tokenAccounts.value
          .map((accountInfo) => {
            const mintAddress = accountInfo.account.data.parsed.info.mint;
            const amount = accountInfo.account.data.parsed.info.tokenAmount.uiAmount || 0;
            return { tokenMint: mintAddress, balance: amount };
          })
          .filter((token) => token.balance > 0);

      const enrichedTokens = await Promise.all(
          tokenList.map(async (token) => {
            try {
              const apiUrl = `/api/fetchTokenData?contractAddress=${token.tokenMint}`;
              const response = await fetch(apiUrl);
              const result = await response.json();

              if (result.success && result.data) {
                return {
                  ...token,
                  agentName: result.data.ok.agentName,
                  price: result.data.ok.price,
                  balance: token.balance,
                  marketCap: result.data.ok.marketCap,
                  priceDeltaPercent: result.data.ok.priceDeltaPercent,
                  liquidity: result.data.ok.liquidity,
                  volume24Hours: result.data.ok.volume24Hours,
                  holdersCount: result.data.ok.holdersCount,
                };
              }
            } catch (err) {
              console.error(`❌ Error fetching data for ${token.tokenMint}:`, err);
            }

            return { ...token, agentName: "Unknown", price: null, marketCap: null };
          })
      );

      setBalances(enrichedTokens);
    } catch (err) {
      console.error("❌ Error fetching token balances:", err);
      setErrors("Failed to fetch token balances.");
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactionHistory = async () => {
    if (!walletAddress) return;

    setLoading(true);
    setHistoricalData([]);

    try {
      const walletPublicKey = new PublicKey(walletAddress);
      const signatures = await connection.getSignaturesForAddress(walletPublicKey, { limit: 20 });

      let balanceTracker = 0;
      const balanceMap = new Map();

      const batchSize = 5;
      for (let i = 0; i < signatures.length; i += batchSize) {
        const batch = signatures.slice(i, i + batchSize);

        const transactions = await Promise.all(
            batch.map(async (sig) => {
              try {
                return await connection.getTransaction(sig.signature, {
                  commitment: "confirmed",
                  maxSupportedTransactionVersion: 0,
                });
              } catch (err) {
                console.error(`❌ Error fetching transaction ${sig.signature}:`, err);
                return null;
              }
            })
        );

        for (const tx of transactions) {
          if (tx) {
            const blockTime = tx.blockTime ? new Date(tx.blockTime * 1000) : new Date();
            const formattedDate = blockTime.toISOString().split("T")[0];

            const amount = (tx.meta?.preBalances[0] - tx.meta?.postBalances[0]) / 1e9 || 0;
            balanceTracker += amount;

            balanceMap.set(formattedDate, {
              date: formattedDate,
              value: balanceTracker.toFixed(4),
            });
          }
        }

        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      setHistoricalData(Array.from(balanceMap.values()).reverse());
    } catch (err) {
      console.error("❌ Error fetching transaction history:", err);
    } finally {
      setLoading(false);
    }
  };

  const totalBalance = balances.reduce((sum, token) => sum + (token.price ? token.price * token.balance : 0), 0);
  const totalMarketCap = balances.reduce((sum, token) => sum + (token.marketCap || 0), 0);
  const topToken = balances.length > 0 ? balances[0].agentName : "No tokens found";

  return (

      <div className="min-h-screen bg-black text-white">
        <main className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold">Overview</h1>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <MetricsCard title="Your Balance" tokens={balances}/>

            {balances.length > 0 && (
                <MetricsCard title="Top Holdings" tokens={balances.slice(0, 3)}/>
            )}

            {balances.length > 3 && (
                balances.slice(3).map((chunk, index) => (
                    <MetricsCard key={index} title={`Other Holdings #${index + 1}`} tokens={[chunk]}/>
                ))
            )}
          </div>


          <Card className="mt-6 p-6 bg-black border-neutral-500">
            <StatsChart data={historicalData}/>
          </Card>

          <Card className="mt-6 p-6 bg-black border-neutral-500">
            <VaultTable tokens={balances}/>
          </Card>
        </main>
      </div>
  );
}

