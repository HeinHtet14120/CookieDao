"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useWallet } from "@/hooks/useWallet";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Transaction, PublicKey, Connection } from "@solana/web3.js";
import { useConnection } from "@solana/wallet-adapter-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { cookieApi } from "../api/cookies";

const USDC_MINT = "EPjFWdd5AufqSSvwxS5uo4ptRG4AkLbS5uLsrD3Hhrf"; // USDC Token Mint
const SOL_MINT = "So11111111111111111111111111111111111111112"; // SOL Token Mint

export default function SwapPage() {
  const searchParams = useSearchParams();
  const { walletAddress } = useWallet();
  const { connection } = useConnection();

  const [inputToken, setInputToken] = useState(searchParams.get("tokenMint") || SOL_MINT);
  const [outputToken, setOutputToken] = useState(USDC_MINT);
  const [amount, setAmount] = useState("");
  const [quote, setQuote] = useState(null);
  const [gasFee, setGasFee] = useState(null);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    if (inputToken && outputToken && amount) {
      fetchSwapQuote();
    }
  }, [inputToken, outputToken, amount]);

  // ✅ Fix: Convert amount to correct unit (lamports or USDC decimals)
  const fetchSwapQuote = async () => {
    if (!amount || parseFloat(amount) === 0) return;
    setLoading(true);

    try {
      const adjustedAmount = inputToken === SOL_MINT ? amount * 1e9 : amount * 1e6; // Convert to correct unit

      const response = await fetch(
          `https://quote-api.jup.ag/v6/quote?inputMint=${inputToken}&outputMint=${outputToken}&amount=${adjustedAmount}&slippageBps=50`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to get swap quote");
      }

      setQuote(data);
      setGasFee(data.otherAmountThreshold / 1e9); // Extract estimated gas fee
    } catch (error) {
      console.error("❌ Error fetching swap quote:", error);
    }
    setLoading(false);
  };

  // ✅ Fix: Pass correct parameters and sign transaction
  const executeSwap = async () => {
    if (!walletAddress || !quote) return;
    setLoading(true);

    try {
      const swapUrl = "https://quote-api.jup.ag/v6/swap";
      const swapBody = {
        quoteResponse: quote,
        userPublicKey: walletAddress,
        wrapAndUnwrapSol: inputToken === SOL_MINT, // Wrap SOL if needed
        dynamicComputeUnitLimit: true, // Allow high compute budget
        prioritizationFeeLamports: 5000, // Optional priority fee
      };

      const response = await fetch(swapUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(swapBody),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Swap transaction failed");
      }

      console.log("✅ Swap Transaction:", data);
      const transaction = Transaction.from(Buffer.from(data.swapTransaction, "base64"));

      // ✅ Sign and send the transaction
      const signedTransaction = await window.solana.signTransaction(transaction);
      const signature = await connection.sendRawTransaction(signedTransaction.serialize());
      console.log("✅ Swap Successful! Signature:", signature);
    } catch (err) {
      console.error("❌ Error executing swap:", err);
    } finally {
      setLoading(false);
    }
  };

  

  const inputTokenAgent = async () => {
    const agent = await cookieApi.getAgentByContract(inputToken);
    setName(agent.ok.agentName);
    return agent.ok.agentName;
  };

  useEffect(() => {
    inputTokenAgent();
  }, [searchParams.get("tokenMint")]);

  return (
    <div className="min-h-screen bg-black text-white p-6 flex items-center justify-center">
    <Card className="w-full max-w-md p-6 bg-[#15202B] border border-[#38444D] rounded-2xl shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-center text-white">Token Swap</h1>
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-[#8899A6] font-medium">Swap From:</label>
          <Select value={inputToken} onValueChange={setInputToken}>
            <SelectTrigger className="w-full bg-[#192734] border-[#38444D] text-white">
              <SelectValue placeholder="Select token" />
            </SelectTrigger>
            <SelectContent className="bg-[#192734] border-[#38444D]">
              <SelectItem value={searchParams.get("tokenMint") || SOL_MINT}>
                {searchParams.get("tokenMint") ? name : "SOL"}
              </SelectItem>
              <SelectItem value={SOL_MINT}>SOL</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-[#8899A6] font-medium">Swap To:</label>
          <Select value={outputToken} onValueChange={setOutputToken}>
            <SelectTrigger className="w-full bg-[#192734] border-[#38444D] text-white">
              <SelectValue placeholder="Select token" />
            </SelectTrigger>
            <SelectContent className="bg-[#192734] border-[#38444D]">
              <SelectItem value={USDC_MINT}>USDC</SelectItem>
              <SelectItem value={SOL_MINT}>SOL</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-[#8899A6] font-medium">Amount:</label>
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-[#192734] border-[#38444D] text-white placeholder-[#8899A6]"
            placeholder="Enter amount"
          />
        </div>

        {quote && (
          <div className="space-y-2 p-4 bg-[#192734] rounded-lg border border-[#38444D]">
            <p className="text-[#8899A6]">
              Expected Output:{" "}
              <span className="font-medium text-white">
                {(quote.outAmount / 1e6).toFixed(6)} {outputToken === USDC_MINT ? "USDC" : "SOL"}
              </span>
            </p>
            <p className="text-[#8899A6]">
              Price Impact: <span className="font-medium text-white">{(quote.priceImpactPct * 100).toFixed(2)}%</span>
            </p>
            <p className="text-[#8899A6]">
              Gas Fee:{" "}
              <span className="font-medium text-white">{gasFee ? `${gasFee.toFixed(6)} SOL` : "Calculating..."}</span>
            </p>
          </div>
        )}

        <Button
          onClick={executeSwap}
          disabled={loading || !quote}
          className="w-full bg-[#1DA1F2] hover:bg-[#1A91DA] text-white font-bold py-3 rounded-full transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Swapping..." : "Swap"}
        </Button>
      </div>
    </Card>
  </div>
  );
}
