"use client";

import { useRebalancer } from "@/hooks/useRebalancer";
import { useWallet } from "@/hooks/useWallet";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ethers } from "ethers";

export default function Dashboard() {
  const { walletAddress, provider } = useWallet();
  const { allocations, setAllocation } = useRebalancer();
  const [tokens, setTokens] = useState<{ address: string; balance: string }[]>(
    [],
  );
  const [selectedToken, setSelectedToken] = useState<string>("");
  const [allocation, setAllocationValue] = useState<number>(0);

  // 🔹 Fetch ERC-20 Token Balances
  useEffect(() => {
    if (!walletAddress || !provider) return;

    const fetchTokens = async () => {
      try {
        const tokenList = [
          {
            address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
            symbol: "DAI",
          },
          // { address: "0xA0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", symbol: "USDC" },
          {
            address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
            symbol: "USDT",
          },
          // { address: "0xC02aaa39b223FE8D0A0e5C4F27eAD9083C756Cc2", symbol: "WETH" },
        ];

        const erc20Abi = [
          "function balanceOf(address owner) view returns (uint256)",
          "function decimals() view returns (uint8)",
        ];

        const balances = await Promise.all(
          tokenList.map(async (token) => {
            const contract = new ethers.Contract(
              token.address,
              erc20Abi,
              provider,
            );
            const balance = await contract.balanceOf(walletAddress);
            const decimals = await contract.decimals();
            return {
              address: token.address,
              balance: ethers.formatUnits(balance, decimals),
              symbol: token.symbol,
            };
          }),
        );

        setTokens(balances);
      } catch (err) {
        console.error("Error fetching token balances:", err);
      }
    };

    fetchTokens();
  }, [walletAddress, provider]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold">Token Allocations</h2>

      {walletAddress ? (
        <>
          {/* Display Available Token Balances */}
          <h3 className="text-lg font-semibold mt-4">Your Tokens:</h3>
          <ul className="mt-2">
            {tokens.map(({ address, balance, symbol }) => (
              <li key={address} className="mb-2">
                <strong>{symbol}:</strong> {balance}
              </li>
            ))}
          </ul>

          {/* Existing Allocations */}
          <h3 className="text-lg font-semibold mt-4">Current Allocations:</h3>
          <ul className="mt-2">
            {allocations.map(({ token, allocation }) => (
              <li key={token} className="mb-2">
                <strong>{token}:</strong> {allocation}%
              </li>
            ))}
          </ul>

          {/* Update Allocations */}
          <div className="mt-6">
            <h3 className="text-xl font-bold">Set Token Allocation</h3>
            <select
              className="border px-3 py-2 w-full mt-2"
              value={selectedToken}
              onChange={(e) => setSelectedToken(e.target.value)}
            >
              <option value="">Select a Token</option>
              {tokens.map(({ address, symbol }) => (
                <option key={address} value={address}>
                  {symbol}
                </option>
              ))}
            </select>
            <Input
              placeholder="New Allocation %"
              type="number"
              value={allocation}
              className="mt-2"
              onChange={(e) => setAllocationValue(Number(e.target.value))}
            />
            <Button
              className="mt-2"
              onClick={() => setAllocation(selectedToken, allocation)}
            >
              Set Allocation
            </Button>
          </div>
        </>
      ) : (
        <p>Please connect your wallet.</p>
      )}
    </div>
  );
}
