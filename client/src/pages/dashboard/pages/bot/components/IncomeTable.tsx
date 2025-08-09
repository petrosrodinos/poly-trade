import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Spinner } from "@/components/ui/spinner";
import type { FuturesIncome } from "@/features/account/interfaces/account.interfaces";

interface IncomeTableProps {
  income?: FuturesIncome[];
  isLoading: boolean;
  formatCurrency: (amount: number) => string;
  formatTimestamp: (timestamp: number) => string;
}

export const IncomeTable = ({ income, isLoading, formatCurrency, formatTimestamp }: IncomeTableProps) => {
  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle>Income History</CardTitle>
        <CardDescription>Detailed breakdown of your income and fees</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Symbol</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Asset</TableHead>
                <TableHead>Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <div className="flex items-center justify-center gap-2">
                      <Spinner size="sm" />
                      <span>Loading income data...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : income && income.length > 0 ? (
                income.slice(0, 10).map((item) => (
                  <TableRow key={item.tranId}>
                    <TableCell className="font-medium">{item.symbol}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.incomeType}</Badge>
                    </TableCell>
                    <TableCell className={parseFloat(item.income) >= 0 ? "text-green-600" : "text-red-600"}>{formatCurrency(parseFloat(item.income))}</TableCell>
                    <TableCell>{item.asset}</TableCell>
                    <TableCell>{formatTimestamp(item.time)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-slate-500">
                    No income data found
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
