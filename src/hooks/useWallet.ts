import { useState, useEffect } from "react";
import { BrowserProvider, JsonRpcSigner } from "ethers";

declare global {
    interface Window {
        ethereum?: any;
    }
}

export const useWallet = () => {
    const [walletAddress, setWalletAddress] = useState<string | null>(null);
    const [provider, setProvider] = useState<BrowserProvider | null>(null);
    const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
    const [error, setError] = useState<string | null>(null);

    // 🔹 Connect Wallet Function
    const connectWallet = async () => {
        try {
            if (!window.ethereum) {
                throw new Error("No Ethereum provider detected. Install MetaMask or a compatible wallet.");
            }

            // Initialize Ethereum provider using Ethers v6
            const ethProvider = new BrowserProvider(window.ethereum);
            setProvider(ethProvider);

            // Request accounts
            const accounts: string[] = await window.ethereum.request({ method: "eth_requestAccounts" });

            if (accounts.length === 0) {
                throw new Error("No accounts found. Please connect your wallet.");
            }

            // Get signer and wallet address
            const signerInstance = await ethProvider.getSigner();
            const address = await signerInstance.getAddress();

            setWalletAddress(address);
            setSigner(signerInstance);
            localStorage.setItem("walletAddress", address); // Save to localStorage
            setError(null);
        } catch (err: any) {
            console.error("Wallet Connection Error:", err);
            setError(err.message);
        }
    };

    // 🔹 Disconnect Wallet Function
    const disconnectWallet = () => {
        setWalletAddress(null);
        setProvider(null);
        setSigner(null);
        localStorage.removeItem("walletAddress"); // Remove wallet from local storage
    };

    // 🔹 Check Connection on Page Load
    useEffect(() => {
        const checkConnection = async () => {
            if (window.ethereum) {
                const ethProvider = new BrowserProvider(window.ethereum);
                setProvider(ethProvider);

                const accounts = await ethProvider.send("eth_accounts", []);
                if (accounts.length > 0) {
                    setWalletAddress(accounts[0]); // Restore connection
                    const signerInstance = await ethProvider.getSigner();
                    setSigner(signerInstance);
                }
            }
        };

        checkConnection();

        // Handle Account Changes
        window.ethereum?.on("accountsChanged", (accounts: string[]) => {
            if (accounts.length > 0) {
                setWalletAddress(accounts[0]);
            } else {
                disconnectWallet();
            }
        });

        // Handle Network Changes
        window.ethereum?.on("chainChanged", () => {
            window.location.reload(); // Reload the app when network changes
        });

        return () => {
            window.ethereum?.removeListener("accountsChanged", () => {});
            window.ethereum?.removeListener("chainChanged", () => {});
        };
    }, []);

    return { walletAddress, provider, signer, connectWallet, disconnectWallet, error };
};
