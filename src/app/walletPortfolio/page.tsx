"use client";

import { useWallet } from "@/hooks/useWallet";
import { useTokens } from "@/hooks/useTokens";

export default function Portfolio() {
    const { walletAddress, ethBalance, connectWallet, disconnectWallet } = useWallet();
    const { tokens, loading, error } = useTokens(walletAddress);

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold">Your Portfolio</h2>

            {walletAddress ? (
                <>
                    <div className="mt-4 p-4 bg-gray-900 rounded-lg">
                        <h3 className="text-xl">Wallet Address:</h3>
                        <p className="text-sm break-all">{walletAddress}</p>
                        <h3 className="text-xl mt-2">Ethereum Balance:</h3>
                        <p className="text-lg font-bold">{ethBalance} ETH</p>
                    </div>

                    <h3 className="text-xl font-bold mt-6">Token Holdings</h3>

                    {loading ? (
                        <p>Loading tokens...</p>
                    ) : error ? (
                        <p className="text-red-500">{error}</p>
                    ) : (
                        <ul className="mt-4">
                            {tokens.length > 0 ? (
                                tokens.map(({ symbol, balance, contractAddress }) => (
                                    <li key={contractAddress} className="mb-2">
                                        <strong>{symbol}:</strong> {balance} tokens
                                        <br />
                                        <small>Contract: {contractAddress}</small>
                                    </li>
                                ))
                            ) : (
                                <p>No ERC-20 tokens found.</p>
                            )}
                        </ul>
                    )}

                    <button className="mt-6 bg-red-500 text-white px-4 py-2 rounded" onClick={disconnectWallet}>
                        Disconnect Wallet
                    </button>
                </>
            ) : (
                <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded" onClick={connectWallet}>
                    Connect Wallet
                </button>
            )}
        </div>
    );
}
