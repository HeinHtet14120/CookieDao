import { useState, useEffect } from "react";
import { BrowserProvider, JsonRpcSigner } from "ethers";

declare global {
    interface Window {
        ethereum?: any;
    }
}

export const useWallet = () => {
    const [walletAddress, setWalletAddress] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const connectWallet = async () => {
        try {
            if (!window.ethereum) {
                throw new Error("MetaMask is not installed.");
            }

            // Create a new Ethers v6 provider
            const provider = new BrowserProvider(window.ethereum);
            const signer: JsonRpcSigner = await provider.getSigner();
            const address = await signer.getAddress(); // Get wallet address

            setWalletAddress(address);
            localStorage.setItem("walletAddress", address); // Save to localStorage
            setError(null);
        } catch (err: any) {
            setError(err.message);
        }
    };

    const disconnectWallet = () => {
        setWalletAddress(null);
        localStorage.removeItem("walletAddress"); // Remove from localStorage
    };

    useEffect(() => {
        const checkConnection = async () => {
            if (window.ethereum) {
                const provider = new BrowserProvider(window.ethereum);
                const accounts = await provider.send("eth_accounts", []);
                if (accounts.length > 0) {
                    setWalletAddress(accounts[0]); // Restore connection
                }
            }
        };

        checkConnection();

        // Handle account changes
        window.ethereum?.on("accountsChanged", (accounts: string[]) => {
            if (accounts.length > 0) {
                setWalletAddress(accounts[0]);
            } else {
                setWalletAddress(null);
            }
        });

        return () => {
            window.ethereum?.removeListener("accountsChanged", () => {});
        };
    }, []);

    return { walletAddress, connectWallet, disconnectWallet, error };
};
