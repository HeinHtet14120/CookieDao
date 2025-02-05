"use client"
import { useState, useEffect } from "react";
import { Connection, PublicKey } from "@solana/web3.js";
import { useWallet } from "@/hooks/useWallet";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const SOLANA_MAINNET_URL =
    "https://tiniest-broken-lake.solana-mainnet.quiknode.pro/c5462950ebb302a25357758b0160085153b91d73/";
const connection = new Connection(SOLANA_MAINNET_URL, "confirmed");

export default function WalletHistory() {
    const { walletAddress } = useWallet();
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (walletAddress) {
            fetchTransactionHistory();
        }
    }, [walletAddress]);

    const fetchTransactionHistory = async () => {
        if (!walletAddress) {
            setError("Wallet not connected.");
            return;
        }

        setLoading(true);
        setError(null);
        setTransactions([]);

        try {
            const walletPublicKey = new PublicKey(walletAddress);

            // 🔹 Fetch recent transactions (signatures)
            const signatures = await connection.getSignaturesForAddress(walletPublicKey, { limit: 10 });

            if (!signatures.length) {
                setError("No transactions found.");
                setLoading(false);
                return;
            }

            // 🔹 Fetch details for each transaction
            const transactionDetails = await Promise.all(
                signatures.map(async (sig) => {
                    const tx = await connection.getTransaction(sig.signature, { commitment: "confirmed" });
                    return {
                        signature: sig.signature,
                        blockTime: tx?.blockTime,
                        sender: tx?.transaction.message.accountKeys[0]?.toBase58(),
                        receiver: tx?.transaction.message.accountKeys[1]?.toBase58(),
                        amount: tx?.meta?.preBalances[0] - tx?.meta?.postBalances[0] || 0, // Balance change
                        fee: tx?.meta?.fee || 0,
                    };
                })
            );

            setTransactions(transactionDetails);
        } catch (err) {
            console.error("❌ Error fetching transaction history:", err);
            setError("Failed to fetch transactions.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white p-6">
            <h1 className="text-2xl font-bold mb-4">Transaction History</h1>
            {walletAddress ? (
                <p className="mb-4 text-sm text-muted-foreground">Wallet: {walletAddress}</p>
            ) : (
                <p className="mb-4 text-sm text-red-500">Wallet not connected.</p>
            )}

            <Button className="bg-black-500" onClick={fetchTransactionHistory} disabled={loading || !walletAddress} variant="outline">
                {loading ? "Fetching..." : "Refresh Transactions"}
            </Button>

            {error && <p className="text-red-500 mt-4">{error}</p>}

            <Card className="mt-6 p-6 bg-black border-neutral-500 text-white">
                <h2 className="text-lg font-semibold text-neutral-300 mb-4">Recent Transactions</h2>
                {transactions.length > 0 ? (
                    <table className="w-full text-left">
                        <thead>
                        <tr className="border-b border-neutral-500">
                            <th className="py-2">Signature</th>
                            <th className="py-2">Sender</th>
                            <th className="py-2">Receiver</th>
                            <th className="py-2">Amount (Lamports)</th>
                            <th className="py-2">Fee</th>
                            <th className="py-2">Time</th>
                        </tr>
                        </thead>
                        <tbody>
                        {transactions.map((tx, index) => (
                            <tr key={index} className="border-b border-neutral-700">
                                <td className="py-2">{tx.signature.slice(0, 10)}...</td>
                                <td className="py-2">{tx.sender.slice(0, 6)}...</td>
                                <td className="py-2">{tx.receiver.slice(0, 6)}...</td>
                                <td className="py-2">{(tx.amount / 1e9).toFixed(6)} SOL</td>
                                <td className="py-2">{(tx.fee / 1e9).toFixed(6)} SOL</td>
                                <td className="py-2">{tx.blockTime ? new Date(tx.blockTime * 1000).toLocaleString() : "N/A"}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="text-neutral-400">No transactions found.</p>
                )}
            </Card>
        </div>
    );
}
