"use client";

import { useState } from "react";
import { Connection, PublicKey } from "@solana/web3.js";
import { useWallet } from "@/hooks/useWallet";

const SOLANA_MAINNET_URL =
    "https://tiniest-broken-lake.solana-mainnet.quiknode.pro/c5462950ebb302a25357758b0160085153b91d73/";
const connection = new Connection(SOLANA_MAINNET_URL, "confirmed");

const COOKIE_API_KEY = "77cdfd4c-132e-4314-ac93-b8ac64f6a2a8"; // 🔹 Replace with your actual API key
const COOKIE_API_URL = "https://api.cookie.fun/v2/agents/contractAddress";

const AvaBalances = () => {
    const { walletAddress, connectWallet, disconnectWallet, error } = useWallet();
    const [balances, setBalances] = useState<
        { tokenMint: string; agentName: string; balance: number; price: number | null; marketCap: number | null }[]
    >([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [errors, setErrors] = useState<string | null>(null);

    // ✅ Fetch Token Balances & Enrich with CookieFun API
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
                        console.log(`🔹 Fetching token data from ${apiUrl}`); // ✅ Debugging log

                        const response = await fetch(apiUrl);
                        const result = await response.json();

                        console.log(`✅ API Response for ${token.tokenMint}:`, result); // ✅ Debugging log

                        // ✅ Extract correct data from API response
                        if (result.success && result.data) {
                            return {
                                ...token,
                                agentName: result.data.ok.agentName || "Unknown", // ✅ Fix: Extract from `ok`
                                price: result.data.ok.price || null, // ✅ Fix: Extract price
                                marketCap: result.data.ok.marketCap || null, // ✅ Fix: Extract market cap
                            };
                        }
                    } catch (err) {
                        console.error(`❌ Error fetching data for ${token.tokenMint}:`, err);
                    }

                    return { ...token, agentName: "Unknown", price: null, marketCap: null };
                })
            );

            console.log("✅ Final Token List:", enrichedTokens); // ✅ Debugging log
            setBalances(enrichedTokens);
        } catch (err) {
            console.error("❌ Error fetching token balances:", err);
            setErrors("Failed to fetch token balances.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Your Solana Token Balances</h1>

            {walletAddress ? (
                <>
                    <p style={styles.walletAddress}>Wallet: {walletAddress}</p>
                    <button onClick={disconnectWallet} style={styles.disconnectButton}>
                        Disconnect Wallet
                    </button>
                </>
            ) : (
                <button onClick={connectWallet} style={styles.button}>
                    Connect Wallet
                </button>
            )}

            <button onClick={fetchAllTokenBalances} disabled={loading || !walletAddress} style={styles.button}>
                {loading ? "Fetching..." : "Fetch All Balances"}
            </button>

            {balances.length > 0 && (
                <div style={styles.resultContainer}>
                    {balances.map(({ tokenMint, agentName, balance, price, marketCap }, index) => (
                        <div key={index} style={styles.result}>
                            <strong>Token:</strong> {agentName} ({tokenMint})
                            <p>Balance: {balance}</p>
                            <p>Price: {price ? `$${price.toFixed(2)}` : "N/A"}</p>
                            <p>Market Cap: {marketCap ? `$${marketCap.toLocaleString()}` : "N/A"}</p>
                        </div>
                    ))}
                </div>
            )}

            {errors && <p style={styles.error}>{errors}</p>}
        </div>
    );
};

// Styles
const styles = {
    container: {
        fontFamily: "Arial, sans-serif",
        textAlign: "center",
        padding: "20px",
        maxWidth: "600px",
        margin: "0 auto",
    },
    title: {
        fontSize: "24px",
        marginBottom: "10px",
    },
    walletAddress: {
        fontSize: "14px",
        color: "#666",
        marginBottom: "20px",
    },
    button: {
        padding: "10px 20px",
        fontSize: "16px",
        backgroundColor: "#007bff",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
    },
    disconnectButton: {
        padding: "10px 20px",
        fontSize: "16px",
        backgroundColor: "#ff4444",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        marginBottom: "10px",
    },
    resultContainer: {
        marginTop: "20px",
        textAlign: "left",
    },
    result: {
        padding: "10px",
        border: "1px solid #ddd",
        marginBottom: "10px",
        borderRadius: "5px",
        backgroundColor: "#f9f9f9",
    },
    error: {
        fontSize: "16px",
        color: "red",
        marginTop: "20px",
    },
};

export default AvaBalances;
