"use client";

import { useState, useEffect } from "react";
import { Connection, PublicKey } from "@solana/web3.js";
import {useWallet} from "@/hooks/useWallet";

const SOLANA_MAINNET_URL =
    "https://tiniest-broken-lake.solana-mainnet.quiknode.pro/c5462950ebb302a25357758b0160085153b91d73/";
const connection = new Connection(SOLANA_MAINNET_URL, "confirmed");



const AvaBalances = () => {
    const { walletAddress, connectWallet, disconnectWallet, error } = useWallet();
    const [balances, setBalances] = useState<
        { tokenMint: string; balance: number }[]
    >([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [errors, setErrors] = useState<string | null>(null);

    const fetchAllTokenBalances = async () => {
        setLoading(true);
        setErrors(null);
        setBalances([]);

        try {
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

            // Extract balances, filtering out 0 balance tokens
            const balanceResults = tokenAccounts.value
                .map((accountInfo) => {
                    const mintAddress = accountInfo.account.data.parsed.info.mint;
                    const amount = accountInfo.account.data.parsed.info.tokenAmount.uiAmount || 0;
                    return { tokenMint: mintAddress, balance: amount };
                })
                .filter((token) => token.balance > 0); // ✅ Remove 0 balance tokens

            setBalances(balanceResults);
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
            <p style={styles.walletAddress}>Wallet: {walletAddress}</p>

            <button onClick={fetchAllTokenBalances} disabled={loading} style={styles.button}>
                {loading ? "Fetching..." : "Fetch All Balances"}
            </button>

            {balances.length > 0 && (
                <div style={styles.resultContainer}>
                    {balances.map(({ tokenMint, balance }, index) => (
                        <div key={index} style={styles.result}>
                            <strong>Token Mint:</strong> {tokenMint === "So11111111111111111111111111111111111111112" ? "Wrapped SOL (wSOL)" : tokenMint}
                            <p>Balance: {balance}</p>
                        </div>
                    ))}
                </div>
            )}

            {error && <p style={styles.error}>{error}</p>}
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
