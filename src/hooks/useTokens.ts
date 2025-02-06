// "use client";
// import { useState, useEffect } from "react";
// import { Connection, PublicKey } from "@solana/web3.js";
// import { ethers } from "ethers";
// import { useWallet } from "./useWallet";
// import { cookieApi } from "@/app/api/cookies";
//
// // ✅ QuickNode Multi-Chain RPC Endpoint
// const QUICKNODE_RPC = {
//   solana:
//     "https://tiniest-broken-lake.solana-mainnet.quiknode.pro/c5462950ebb302a25357758b0160085153b91d73/",
//   ethereum: "https://eth.llamarpc.com", // Ethereum
//   bsc: "https://bsc-dataseed.binance.org", // Binance Smart Chain (BNB)
//   polygon: "https://polygon-rpc.com", // Polygon (MATIC)
//   avalanche: "https://api.avax.network/ext/bc/C/rpc", // Avalanche (AVAX)
//   arbitrum: "https://arb1.arbitrum.io/rpc", // Arbitrum
// };
//
// // ✅ Solana Token Program ID
//
// // ✅ ERC-20 ABI (For EVM Token Balance Fetching)
// const ERC20_ABI = [
//   "function balanceOf(address owner) view returns (uint256)",
//   "function decimals() view returns (uint8)",
//   "function symbol() view returns (string)",
// ];
//
// export const useTokens = () => {
//   const { walletAddress } = useWallet();
//   const [tokens, setTokens] = useState<
//     { name: string; symbol: string; balance: string; chain: number }[]
//   >([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//
//   useEffect(() => {
//     if (!walletAddress) return;
//
//     const fetchAllTokens = async () => {
//       try {
//         setLoading(true);
//         console.log(
//           "🔹 Fetching contract addresses from CookieFun API...",
//           walletAddress,
//         );
//
//         // ✅ Fetch **ALL** Contract Addresses from CookieFun API
//         const allTokens = await fetchAllContractAddresses();
//         if (allTokens.length === 0)
//           throw new Error("No tokens found in CookieFun API.");
//
//         console.log(
//           `✅ Successfully fetched ${allTokens.length} tokens from CookieFun API`,
//         );
//
//         // ✅ Fetch Wallet Balances using QuickNode API
//         console.log("🔹 Fetching balances from QuickNode...");
//         const walletBalances = await fetchWalletBalances(
//           walletAddress,
//           allTokens,
//         );
//
//         setTokens(walletBalances);
//         setLoading(false);
//       } catch (err: unknown) {
//         console.error("❌ Error fetching tokens:", err);
//         // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//         // @ts-expect-error
//         setError(err.message);
//         setLoading(false);
//       }
//     };
//
//     fetchAllTokens();
//   }, [walletAddress]);
//
//   return { tokens, loading, error };
// };
//
// // ✅ **Fetch All Contract Addresses from CookieFun API (Handles ALL Pages)**
// const fetchAllContractAddresses = async () => {
//   try {
//     const allContractAddresses: string[] = []; // Array to store all contract addresses
//     let page = 1;
//     let hasMorePages = true;
//     const delayMs = 2000; // Delay time in milliseconds (2 seconds)
//
//     const delay = (ms: number) =>
//       new Promise((resolve) => setTimeout(resolve, ms));
//
//     while (hasMorePages) {
//       console.log(`🔄 Fetching page ${page} from CookieFun API...`);
//
//       try {
//         const response = await cookieApi.getAgentsPaged(page);
//
//         if (response.success && response.ok.data) {
//           response.ok.data.forEach((token) => {
//             token.contracts.forEach((contract) => {
//               allContractAddresses.push(contract.contractAddress);
//               console.log(
//                 `🔹 Page ${page} Contract Address: ${contract.contractAddress}`,
//               );
//             });
//           });
//
//           // ✅ Check if we have reached the last page
//           hasMorePages = page < response.ok.totalPages;
//           page++;
//         } else {
//           hasMorePages = false;
//         }
//       } catch (error) {
//         console.error(`❌ Error fetching page ${page}:`, error);
//         hasMorePages = false;
//       }
//
//       // Wait before making the next request to avoid hitting rate limits
//       console.log(
//         `⏳ Waiting ${delayMs / 1000} seconds before the next request...`,
//       );
//       await delay(delayMs);
//     }
//
//     console.log(
//       `✅ Successfully fetched ${allContractAddresses.length} contract addresses.`,
//     );
//     console.log("📜 All Contract Addresses:", allContractAddresses);
//     return allContractAddresses;
//   } catch (error) {
//     console.error("❌ Error fetching token contracts:", error);
//     return [];
//   }
// };
//
// // 🔹 Call the function to fetch all contract addresses
// fetchAllContractAddresses();
//
// // 🔹 Call the function to test
//
// // ✅ Fetch Wallet Balances using QuickNode (For Solana & EVM Chains)
// const fetchWalletBalances = async (walletAddress: string, allTokens: any[]) => {
//   try {
//     const connection = new Connection(QUICKNODE_RPC.solana);
//     const walletPublicKey = new PublicKey(walletAddress);
//     let tokenBalances: any[] = [];
//
//     // ✅ Loop Through All Tokens
//     for (const token of allTokens) {
//       const tokenContract = token.contractAddress;
//       const tokenChain = token.chain;
//
//       if (!tokenContract || !tokenChain) continue;
//
//       try {
//         if (tokenChain === "solana") {
//           // ✅ Fetch SPL Token Balances (Solana)
//           const tokenMintPublicKey = new PublicKey(tokenContract);
//           const tokenAccounts = await connection.getTokenAccountsByOwner(
//             walletPublicKey,
//             {
//               mint: tokenMintPublicKey,
//             },
//           );
//
//           if (tokenAccounts.value.length > 0) {
//             const balance = await connection.getTokenAccountBalance(
//               tokenAccounts.value[0].pubkey,
//             );
//             tokenBalances.push({
//               name: token.agentName || "Unknown",
//               symbol: token.symbol || "SPL",
//               balance: balance.value.uiAmountString || "0",
//               chain: "solana",
//             });
//           }
//         } else {
//           // ✅ Fetch ERC-20 Token Balances (Ethereum, BSC, Polygon, etc.)
//           const provider = new ethers.JsonRpcProvider(
//             QUICKNODE_RPC[tokenChain],
//           );
//           const contract = new ethers.Contract(
//             tokenContract,
//             ERC20_ABI,
//             provider,
//           );
//
//           const balance = await contract.balanceOf(walletAddress);
//           tokenBalances.push({
//             name: token.agentName || "Unknown",
//             symbol: token.symbol || "ERC20",
//             balance: ethers.formatUnits(balance, 18),
//             chain: tokenChain,
//           });
//         }
//       } catch (fetchError) {
//         console.error(
//           `❌ Error fetching balance for ${tokenContract} on chain ${tokenChain}:`,
//           fetchError,
//         );
//       }
//     }
//
//     console.log(
//       `✅ Successfully fetched ${tokenBalances.length} wallet balances`,
//     );
//     return tokenBalances;
//   } catch (error) {
//     console.error("❌ Error fetching wallet balances:", error);
//     return [];
//   }
// };
