import { useState, useEffect } from "react";
import {
  BrowserProvider,
  JsonRpcSigner,
  Contract,
  formatUnits,
  parseUnits,
} from "ethers";
import { useWallet } from "@/hooks/useWallet";
import { ABI } from "@/config/abi"; // Ensure ABI file exists

export const useRebalancer = () => {
  const { walletAddress, provider, signer } = useWallet();
  const [contract, setContract] = useState<Contract | null>(null);
  const [allocations, setAllocations] = useState<
    { token: string; allocation: number }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const CONTRACT_ADDRESS = "0xd0ED5f2e307CA1e40b8454ADeE57593B33392FC6";
  // 🔹 Initialize Smart Contract Instance
  useEffect(() => {
    if (signer) {
      const rebalancerContract = new Contract(CONTRACT_ADDRESS, ABI, signer);
      setContract(rebalancerContract);
    }
  }, [signer]);

  // 🔹 Fetch Token Allocations
  const fetchAllocations = async () => {
    if (!contract) return;
    setLoading(true);
    try {
      const tokenList: string[] = await contract.getAllowedTokens();
      const allocationsData = await Promise.all(
        tokenList.map(async (token) => {
          const allocation = await contract.tokenAllocations(token);
          return { token, allocation: Number(formatUnits(allocation, 0)) };
        }),
      );
      setAllocations(allocationsData);
    } catch (err) {
      setError("Error fetching allocations");
      console.error("Fetch Error:", err);
    }
    setLoading(false);
  };

  // 🔹 Set Allocation for a Token
  const setAllocation = async (token: string, allocation: number) => {
    if (!contract) return;
    setLoading(true);
    try {
      const tx = await contract.setTokenAllocation(
        token,
        parseUnits(allocation.toString(), 0),
      );
      await tx.wait();
      fetchAllocations(); // Refresh UI after setting allocation
    } catch (err) {
      setError("Failed to set allocation");
      console.error("Set Allocation Error:", err);
    }
    setLoading(false);
  };

  // 🔹 Suggest Swap (Doesn't Execute, Just Logs)
  const suggestSwap = async (
    fromToken: string,
    toToken: string,
    amount: number,
  ) => {
    if (!contract) return;
    setLoading(true);
    try {
      const tx = await contract.suggestSwap(
        fromToken,
        toToken,
        parseUnits(amount.toString(), 18),
      );
      await tx.wait();
    } catch (err) {
      setError("Swap suggestion failed");
      console.error("Swap Suggestion Error:", err);
    }
    setLoading(false);
  };

  return {
    contract,
    allocations,
    setAllocation,
    suggestSwap,
    fetchAllocations,
    loading,
    error,
    walletAddress,
  };
};
