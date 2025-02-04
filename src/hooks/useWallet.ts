import { useState, useEffect } from "react";
import { BrowserProvider, JsonRpcSigner, formatEther } from "ethers";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export const useWallet = () => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
  const [networkName, setNetworkName] = useState<string | null>(null);
  const [ethBalance, setEthBalance] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 🔹 Connect Wallet Function
  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        throw new Error(
          "No Ethereum provider detected. Install MetaMask or a compatible walletPortfolio.",
        );
      }

      // Initialize Ethereum provider
      const ethProvider = new BrowserProvider(window.ethereum);
      setProvider(ethProvider);

      // Request accounts
      const accounts: string[] = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts.length === 0) {
        throw new Error(
          "No accounts found. Please connect your walletPortfolio.",
        );
      }

      // Get signer, walletPortfolio address, and network details
      const signerInstance = await ethProvider.getSigner();
      const address = await signerInstance.getAddress();
      const network = await ethProvider.getNetwork();

      setWalletAddress(address);
      setSigner(signerInstance);
      setNetworkName(network.name);

      // Fetch ETH balance
      fetchEthBalance(address, ethProvider);

      localStorage.setItem("walletAddress", address);
      setError(null);
    } catch (err: any) {
      console.error("Wallet Connection Error:", err);
      setError(err.message);
    }
  };

  // 🔹 Fetch ETH Balance
  const fetchEthBalance = async (
    address: string,
    ethProvider: BrowserProvider,
  ) => {
    try {
      const balance = await ethProvider.getBalance(address);
      setEthBalance(formatEther(balance));
    } catch (err) {
      console.error("❌ Error fetching ETH balance:", err);
    }
  };

  // 🔹 Disconnect Wallet Function
  const disconnectWallet = () => {
    setWalletAddress(null);
    setProvider(null);
    setSigner(null);
    setNetworkName(null);
    setEthBalance(null);
    localStorage.removeItem("walletAddress");
  };

  // 🔹 Check Connection on Page Load
  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        const ethProvider = new BrowserProvider(window.ethereum);
        setProvider(ethProvider);

        const accounts = await ethProvider.send("eth_accounts", []);
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          const signerInstance = await ethProvider.getSigner();
          setSigner(signerInstance);

          const network = await ethProvider.getNetwork();
          setNetworkName(network.name);

          fetchEthBalance(accounts[0], ethProvider);
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
      window.location.reload();
    });

    return () => {
      window.ethereum?.removeListener("accountsChanged", () => {});
      window.ethereum?.removeListener("chainChanged", () => {});
    };
  }, []);

  return {
    walletAddress,
    provider,
    signer,
    networkName,
    ethBalance,
    connectWallet,
    disconnectWallet,
    error,
  };
};
