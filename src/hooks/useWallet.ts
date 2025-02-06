"use client";
import { useState, useEffect } from "react";



export const useWallet = () => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);


  // 🔹 Connect Wallet Function
  const connectWallet = async () => {
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      if (!window.solana || !window.solana.isPhantom) {
        throw new Error("Phantom wallet not detected. Please install Phantom.");
      }
      // Request wallet connection
      const response = await (window as unknown as { solana: { connect: () => Promise<{ publicKey: { toString: () => string } }> } }).solana.connect();
      console.log(response.publicKey.toString());
      setWalletAddress(response.publicKey.toString());
    } catch (err: unknown) {
      console.error("Wallet Connection Error:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    }
  };

  // 🔹 Disconnect Wallet Function
  const disconnectWallet = () => {
    setWalletAddress(null);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    window.solana.disconnect();
  };

  // 🔹 Check Connection on Page Load
  useEffect(() => {
    const checkConnection = async () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      if (window.solana && window.solana.isPhantom) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        const response = await window.solana.connect({ onlyIfTrusted: true });
        setWalletAddress(response.publicKey.toString());
      }
    };

    checkConnection();
  }, []);

  return { walletAddress, connectWallet, disconnectWallet, error };
};
