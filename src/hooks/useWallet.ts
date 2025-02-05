'use client'
import { useState, useEffect } from "react";

export const useWallet = () => {
    const [walletAddress, setWalletAddress] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // 🔹 Connect Wallet Function
    const connectWallet = async () => {
        try {
            if (!window.solana || !window.solana.isPhantom) {
                throw new Error("Phantom wallet not detected. Please install Phantom.");
            }

            // Request wallet connection
            const response = await window.solana.connect();
            console.log(response.publicKey.toString());
            setWalletAddress(response.publicKey.toString());
        } catch (err: any) {
            console.error("Wallet Connection Error:", err);
            setError(err.message);
        }
    };

    // 🔹 Disconnect Wallet Function
    const disconnectWallet = () => {
        setWalletAddress(null);
        window.solana.disconnect();
    };

    // 🔹 Check Connection on Page Load
    useEffect(() => {
        const checkConnection = async () => {
            if (window.solana && window.solana.isPhantom) {
                const response = await window.solana.connect({ onlyIfTrusted: true });
                setWalletAddress(response.publicKey.toString());
            }
        };

        checkConnection();
    }, []);

    return { walletAddress, connectWallet, disconnectWallet, error };
};