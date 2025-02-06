import { useRouter } from "next/navigation";
import { Avatar } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal } from "lucide-react";

interface TokenData {
  tokenMint: string;
  agentName: string;
  price: number;
  balance: number;
  marketCap: number;
  priceDeltaPercent: number;
  liquidity: number;
}

interface VaultTableProps {
  tokens: TokenData[];
}

export function VaultTable({ tokens }: VaultTableProps) {
  const router = useRouter();

  return (
      <Table>
        <TableHeader>
          <TableRow className="border-neutral-500">
            <TableHead className="font-bold text-neutral-300">Vault</TableHead>
            <TableHead className="font-bold text-neutral-300">Daily</TableHead>
            <TableHead className="font-bold text-neutral-300">Balance ↓</TableHead>
            <TableHead className="font-bold text-neutral-300">Liquidity</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tokens.map((token, index) => (
              <TableRow
                  key={index}
                  className="border-neutral-500 text-white cursor-pointer hover:bg-neutral-800"
                  onClick={() => router.push(`/swap?tokenMint=${token.tokenMint}`)}
              >
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <img src={`/placeholder.svg?height=24&width=24`} alt={token.agentName} />
                    </Avatar>
                    <div>
                      <div className="font-medium">{token.agentName}</div>
                      <div className="text-xs text-muted-foreground">${token.price}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className={token.priceDeltaPercent >= 0 ? "text-green-500" : "text-red-500"}>
                  {token.priceDeltaPercent}%
                </TableCell>
                <TableCell>${(token.price * token.balance).toFixed(2)}</TableCell>
                <TableCell>{(token.liquidity / 1e6).toFixed(2)}M</TableCell>
                <TableCell>
                  <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                </TableCell>
              </TableRow>
          ))}
        </TableBody>
      </Table>
  );
}
