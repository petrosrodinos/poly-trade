import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Spinner } from "@/components/ui/spinner";
import { BarChart3, Target, DollarSign } from "lucide-react";
import type { AccountSummary } from "@/features/account/interfaces/account.interfaces";
import { useFormatters } from "../hooks";

interface PerformanceOverviewProps {
  accountStatus?: AccountSummary;
  isLoading?: boolean;
}

export const PerformanceOverview = ({ accountStatus, isLoading }: PerformanceOverviewProps) => {
  const { formatCurrency, formatNumber } = useFormatters();

  const calculateProfitPercentage = () => {
    if (!accountStatus?.totalWalletBalance || !accountStatus?.income.netProfit) return 0;
    return (accountStatus.income.netProfit / accountStatus.totalWalletBalance) * 100;
  };

  const profitPercentage = calculateProfitPercentage();
  const isProfit = profitPercentage >= 0;

  return (
    <Card className="lg:col-span-2 border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center">
          <BarChart3 className="w-5 h-5 mr-2" />
          Performance Overview
        </CardTitle>
        <CardDescription>Your trading performance metrics</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-2">
              <Spinner size="md" />
              <span>Loading performance data...</span>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Profit Margin</span>
                <span className={isProfit ? "text-green-600" : "text-red-600"}>{profitPercentage.toFixed(2)}%</span>
              </div>
              <Progress value={Math.abs(profitPercentage)} className="h-2" />
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <Target className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{formatNumber(accountStatus?.income.trades || 0)}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Total Trades</div>
              </div>
              <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <DollarSign className="w-8 h-8 mx-auto mb-2 text-green-500" />
                <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{formatCurrency(accountStatus?.income.averageProfit || 0)}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Avg Profit</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
