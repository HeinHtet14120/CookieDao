"use client";

import { useRebalancer } from "@/hooks/useRebalancer";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SwapPage() {
  const { walletAddress, suggestSwap } = useRebalancer();
  const [fromToken, setFromToken] = useState<string>("");
  const [toToken, setToToken] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold">Swap Tokens</h2>
      {walletAddress ? (
        <div className="mt-4">
          <Input
            placeholder="From Token"
            value={fromToken}
            onChange={(e) => setFromToken(e.target.value)}
          />
          <Input
            placeholder="To Token"
            value={toToken}
            onChange={(e) => setToToken(e.target.value)}
          />
          <Input
            placeholder="Amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          />
          <Button onClick={() => suggestSwap(fromToken, toToken, amount)}>
            Execute Swap
          </Button>
        </div>
      ) : (
        <p>Please connect your wallet.</p>
      )}
    </div>
  );
}
