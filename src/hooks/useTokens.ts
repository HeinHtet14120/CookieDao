import { useState, useEffect } from "react";
import { ethers } from "ethers";

const ETHERSCAN_API_KEY = "EGCRVPKQVJ1VZF6BEJUAJG8W97UTG4IIZT"; // Replace with your Etherscan API Key
const ETHERSCAN_API_URL = "https://api.etherscan.io/api";

export const useTokens = (walletAddress: string | null) => {
  const [tokens, setTokens] = useState<
    { symbol: string; balance: string; contractAddress: string }[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!walletAddress) return;

    const fetchTokens = async () => {
      try {
        setLoading(true);

        console.log(`🔍 Fetching ERC-20 tokens for ${walletAddress}...`);

        const url = `${ETHERSCAN_API_URL}?module=account&action=tokentx&address=${walletAddress}&sort=desc&apikey=${ETHERSCAN_API_KEY}`;

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(
            `Etherscan API Error: ${response.status} - ${response.statusText}`,
          );
        }

        const data = await response.json();
        console.log("🔹 Etherscan Response:", data);

        if (data.status !== "1" || !data.result || data.result.length === 0) {
          setTokens([]); // ✅ Return empty list instead of error
          setLoading(false);
          return;
        }

        const uniqueTokens: { [contract: string]: any } = {};

        data.result.forEach((tx: any) => {
          const contractAddress = tx.contractAddress.toLowerCase();
          if (!uniqueTokens[contractAddress]) {
            uniqueTokens[contractAddress] = {
              symbol: tx.tokenSymbol,
              balance: ethers.formatUnits(tx.value, tx.tokenDecimal),
              contractAddress,
            };
          }
        });

        setTokens(Object.values(uniqueTokens));
        setLoading(false);
      } catch (err: any) {
        console.error("❌ Error fetching token balances:", err);
        setTokens([]); // ✅ Handle errors by setting an empty list
        setError("Failed to load tokens.");
        setLoading(false);
      }
    };

    fetchTokens();
  }, [walletAddress]);

  return { tokens, loading, error };
};
