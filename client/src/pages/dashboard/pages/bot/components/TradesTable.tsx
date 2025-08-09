import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Spinner } from "@/components/ui/spinner";
import type { FuturesTrade } from "@/features/account/interfaces/account.interfaces";

interface TradesTableProps {
  trades?: FuturesTrade[];
  isLoading: boolean;
  formatCurrency: (amount: number) => string;
  formatTimestamp: (timestamp: number) => string;
}

export const TradesTable = ({ trades, isLoading, formatCurrency, formatTimestamp }: TradesTableProps) => {
  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle>Recent Trades</CardTitle>
        <CardDescription>Your latest trading activity</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Symbol</TableHead>
                <TableHead>Side</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>PnL</TableHead>
                <TableHead>Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="flex items-center justify-center gap-2">
                      <Spinner size="sm" />
                      <span>Loading trades...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : trades && trades.length > 0 ? (
                trades.slice(0, 10).map((trade) => (
                  <TableRow key={trade.id}>
                    <TableCell className="font-medium">{trade.symbol}</TableCell>
                    <TableCell>
                      <Badge variant={trade.side === "BUY" ? "default" : "destructive"}>{trade.side}</Badge>
                    </TableCell>
                    <TableCell>{formatCurrency(parseFloat(trade.price))}</TableCell>
                    <TableCell>{trade.qty}</TableCell>
                    <TableCell className={parseFloat(trade.realizedPnl) >= 0 ? "text-green-600" : "text-red-600"}>{formatCurrency(parseFloat(trade.realizedPnl))}</TableCell>
                    <TableCell>{formatTimestamp(trade.time)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-slate-500">
                    No trades found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
