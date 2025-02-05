import { Avatar } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal } from "lucide-react";

interface TokenData {
  agentName: string;
  price: number;
  balance: number;
  marketCap: number;
  priceDeltaPercent: number;
  liquidity: number;
  volume24Hours: number;
  holdersCount: number;
}

interface VaultTableProps {
  tokens: TokenData[];
}

export function VaultTable({ tokens }: VaultTableProps) {
  return (
      <Table>
        <TableHeader>
          <TableRow className="border-neutral-500 ">
            <TableHead className="font-bold text-neutral-300">Vault</TableHead>
            <TableHead className="font-bold text-neutral-300">Daily</TableHead>
            <TableHead className="font-bold text-neutral-300">Balance ↓</TableHead>
            <TableHead className="font-bold text-neutral-300">APY ↓</TableHead>
            <TableHead className="font-bold text-neutral-300">State</TableHead>
            <TableHead className="font-bold text-neutral-300">Start date</TableHead>
            <TableHead className="font-bold text-neutral-300">Liquidity</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tokens.map((token, index) => (
              <TableRow key={index} className="border-neutral-500 text-white">
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <img src={`/placeholder.svg?height=24&width=24`} alt={token.agentName} />
                    </Avatar>
                    <div>
                      <div className="font-medium">{token.agentName}</div>
                      <div className="text-xs text-muted-foreground">${token.price.toFixed(2)}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className={token.priceDeltaPercent >= 0 ? "text-green-500" : "text-red-500"}>
                  {token.priceDeltaPercent.toFixed(2)}%
                </TableCell>
                <TableCell>${(token.price * token.balance).toFixed(2)}</TableCell>
                <TableCell>{(token.marketCap / 1e6).toFixed(2)}M</TableCell>
                <TableCell>
              <span
                  className={`inline-flex items-center rounded-full px-2 py-1 text-xs ${
                      token.liquidity > 1e6 ? "bg-yellow-500/10 text-yellow-500" : "bg-green-500/10 text-green-500"
                  }`}
              >
                {token.liquidity > 1e6 ? "Fixed" : "Flexible"}
              </span>
                </TableCell>
                <TableCell>N/A</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div
                            key={i}
                            className={`h-1.5 w-3 rounded-full ${
                                i < (token.liquidity > 1e6 ? 3 : token.liquidity > 5e5 ? 2 : 1) ? "bg-primary" : "bg-muted"
                            }`}
                        />
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                </TableCell>
              </TableRow>
          ))}
        </TableBody>
      </Table>
  );
}