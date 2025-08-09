import { StatCard } from "./StatCard";
import type { AccountSummary } from "@/features/account/interfaces/account.interfaces";
import { TrendingUp, TrendingDown, Activity, Wallet, PieChart } from "lucide-react";
import { useFormatters, useProfitCalculations } from "../../../../hooks";

interface StatCardsProps {
  accountStatus: AccountSummary;
  isAccountLoading: boolean;
}

export const StatCards = ({ accountStatus, isAccountLoading }: StatCardsProps) => {
  const { profitPercentage, isProfit } = useProfitCalculations(accountStatus);
  const { formatCurrency, formatNumber } = useFormatters();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard title="Total Balance" value={formatCurrency(accountStatus?.totalWalletBalance || 0)} subtitle={`Available: ${formatCurrency(accountStatus?.availableBalance || 0)}`} icon={Wallet} gradientFrom="from-blue-500" gradientTo="to-blue-600" isLoading={isAccountLoading} />
      <StatCard title="Net Profit" value={formatCurrency(accountStatus?.income.netProfit || 0)} subtitle={`${isProfit ? "+" : ""}${profitPercentage.toFixed(2)}% return`} icon={isProfit ? TrendingUp : TrendingDown} gradientFrom="from-green-500" gradientTo="to-green-600" isLoading={isAccountLoading} />
      <StatCard title="Total Trades" value={formatNumber(accountStatus?.income.trades || 0)} subtitle={`Avg Profit: ${formatCurrency(accountStatus?.income.averageProfit || 0)}`} icon={Activity} gradientFrom="from-purple-500" gradientTo="to-purple-600" isLoading={isAccountLoading} />
      <StatCard title="Commission" value={formatCurrency(accountStatus?.income.commission || 0)} subtitle={`Avg: ${formatCurrency(accountStatus?.income.averageCommission || 0)}`} icon={PieChart} gradientFrom="from-orange-500" gradientTo="to-orange-600" isLoading={isAccountLoading} />
    </div>
  );
};
