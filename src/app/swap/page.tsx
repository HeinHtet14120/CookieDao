"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useWallet } from "@/hooks/useWallet";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const USDC_MINT = "EPjFWdd5AufqSSvwxS5uo4ptRG4AkLbS5uLsrD3Hhrf"; // USDC Token Mint

export default function SwapPage() {
  const searchParams = useSearchParams();
  const { walletAddress } = useWallet();

  const [inputToken, setInputToken] = useState(searchParams.get("tokenMint") || "So11111111111111111111111111111111111111112");
  const [outputToken, setOutputToken] = useState(USDC_MINT);
  const [amount, setAmount] = useState("");
  const [quote, setQuote] = useState(null);
  const [gasFee, setGasFee] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (inputToken && outputToken && amount) {
      fetchSwapQuote();
    }
  }, [inputToken, outputToken, amount]);

  const fetchSwapQuote = async () => {
    if (!amount || parseFloat(amount) === 0) return;

    setLoading(true);
    try {
      const response = await fetch(
          `https://quote-api.jup.ag/v6/quote?inputMint=${inputToken}&outputMint=${outputToken}&amount=${amount}&slippageBps=50`
      );
      const data = await response.json();
      setQuote(data);
      setGasFee(data.otherAmountThreshold / 1e9); // Extract gas fee estimate
    } catch (error) {
      console.error("Error fetching swap quote:", error);
    }
    setLoading(false);
  };

  const executeSwap = async () => {
    if (!walletAddress || !quote) return;

    setLoading(true);
    try {
      const response = await fetch("https://quote-api.jup.ag/v6/swap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          route: quote,
          userPublicKey: walletAddress,
          wrapAndUnwrapSol: true,
        }),
      });

      const swapData = await response.json();
      console.log("Swap Transaction:", swapData);
      alert("Swap Successful! Check your wallet.");
    } catch (error) {
      console.error("Error executing swap:", error);
    }
    setLoading(false);
  };

  return (
      <div className="min-h-screen bg-black text-white p-6">
        <h1 className="text-2xl font-bold mb-4">Token Swap</h1>

        <Card className="p-6 bg-black border-neutral-500">
          <div className="flex flex-col space-y-4">
            {/* Token Selection */}
            <label className="text-gray-400">Swap From:</label>
            <select
                value={inputToken}
                onChange={(e) => setInputToken(e.target.value)}
                className="p-2 bg-neutral-800 rounded"
            >
              <option value={searchParams.get("tokenMint")}>{searchParams.get("tokenMint")}</option>
              <option value="So11111111111111111111111111111111111111112">SOL</option>
            </select>

            <label className="text-gray-400">Swap To:</label>
            <select
                value={outputToken}
                onChange={(e) => setOutputToken(e.target.value)}
                className="p-2 bg-neutral-800 rounded"
            >
              <option value={USDC_MINT}>USDC</option>
              <option value="So11111111111111111111111111111111111111112">SOL</option>
            </select>

            {/* Amount Input */}
            <label className="text-gray-400">Amount:</label>
            <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="p-2 bg-neutral-800 rounded w-full"
                placeholder="Enter amount"
            />

            {/* Swap Quote */}
            {quote && (
                <div className="text-gray-300">
                  <p>Expected Output: {quote.outAmount / 1e6} {outputToken === USDC_MINT ? "USDC" : "SOL"}</p>
                  <p>Price Impact: {quote.priceImpactPct * 100}%</p>
                  <p>Gas Fee: {gasFee ? `${gasFee.toFixed(6)} SOL` : "Calculating..."}</p>
                </div>
            )}

            {/* Swap Button */}
            <Button onClick={executeSwap} disabled={loading || !quote} className="w-full bg-yellow-500">
              {loading ? "Swapping..." : "Swap"}
            </Button>
          </div>
        </Card>
      </div>
  );
}
