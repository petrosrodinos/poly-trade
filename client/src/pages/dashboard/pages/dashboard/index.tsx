import { useAccountStatus } from "@/features/account/hooks/use-account";
import { DashboardHeader, BotsStatus, BotsGrid } from "./components";
import { StatCards } from "./components/Stats/StatCards";
import { PerformanceOverview } from "./components/PerformanceOverview";
import { IncomeChart } from "@/pages/dashboard/pages/dashboard/components/IncomeChart";
import { useBots } from "@/features/bot/hooks/use-bot";

const DashboardPage = () => {
  const { data: accountStatus, isLoading: isAccountLoading, isRefetching: isRefetchingAccount, refetch: refetchAccount } = useAccountStatus();
  const { data: bots, isLoading: isLoading } = useBots();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <DashboardHeader refetch={refetchAccount} isRefreshing={isAccountLoading || isLoading || isRefetchingAccount} />

        <StatCards accountStatus={accountStatus!} isAccountLoading={isAccountLoading} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <PerformanceOverview accountStatus={accountStatus} isLoading={isAccountLoading} />
          <BotsStatus bots={bots || []} />
        </div>

        <div className="grid grid-cols-1 gap-6">
          <IncomeChart title="Income Performance" height={350} />
        </div>

        <BotsGrid bots={bots || []} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default DashboardPage;
