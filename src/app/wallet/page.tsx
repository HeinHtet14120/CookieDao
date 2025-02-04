"use client"
import { ethers } from "ethers";
import React, { useEffect } from "react";

const Page = () => {
    const WALLET_ADDRESS = "0x912d2331d804ba452a1d192de50498badf2c7885";

    useEffect(() => {
        async function fetchEthBalance() {
            try {
                // Validate and correct the wallet address checksum
                const correctedAddress = ethers.getAddress(WALLET_ADDRESS);

                // Ensure `window.ethereum` is available
                if (!window.ethereum) {
                    console.error("MetaMask is not installed!");
                    return;
                }

                // Initialize provider
                const provider = new ethers.BrowserProvider(window.ethereum);

                // Fetch ETH balance
                const balance = await provider.getBalance(correctedAddress);

                // Convert balance to human-readable format (Ether)
                const formattedBalance = ethers.formatEther(balance);

                console.log(`✅ Ethereum Balance: ${formattedBalance} ETH`);
            } catch (error) {
                console.error("❌ Error fetching Ethereum balance:", error);
            }
        }

        fetchEthBalance();
    }, []); // Empty dependency array ensures this runs only on the client side

    return (
        <div>
            <h1>Hello</h1>
            <p>Check the console for your Ethereum balance!</p>
        </div>
    );
};

export default Page;
