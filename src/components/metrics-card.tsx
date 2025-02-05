import { Card } from "@/components/ui/card";
import { ArrowUpRight, TrendingDown, TrendingUp } from "lucide-react";
import type React from "react";

interface TokenData {
    agentName: string;
    price: number;
    balance: number;
    marketCap: number;
    priceDeltaPercent: number;
}

interface MetricsCardProps {
    title: string;
    tokens?: TokenData[]; // ✅ Made tokens optional
}

export function MetricsCard({ title, tokens = [] }: MetricsCardProps) { // ✅ Default empty array
    const totalValue = tokens.reduce((sum, token) => sum + ((token.price || 0) * (token.balance || 0)), 0);

    return (
        <Card className="p-4 bg-[#1E2329] text-white border-none">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-300">{title}</h3>
                <ArrowUpRight className="h-4 w-4 text-gray-400" />
            </div>
            <div className="space-y-2">
                <p className="text-2xl font-bold">${totalValue.toFixed(2)}</p>
                {tokens.length > 0 ? (
                    tokens.map((token, index) => (
                        <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                {token.priceDeltaPercent >= 0 ? (
                                    <TrendingUp className="h-4 w-4 text-[#F0B90B]" />
                                ) : (
                                    <TrendingDown className="h-4 w-4 text-red-500" />
                                )}
                                <span className="text-sm font-medium text-gray-300">{token.agentName}</span>
                            </div>
                            <span className="text-sm font-medium text-gray-300">
                                ${((token.price || 0) * (token.balance || 0)).toFixed(2)}
                            </span>
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-gray-400">No tokens found</p>
                )}
            </div>
        </Card>
    );
}
