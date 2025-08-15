import { useAccountStatus } from "@/features/account/hooks/use-account";
import { DashboardHeader } from "./components";
import { StatCards } from "./components/Stats/StatCards";
import { PerformanceOverview } from "./components/PerformanceOverview";
import { IncomeChart } from "./components/IncomeChart";

const DashboardPage = () => {
  const { data: accountStatus, isLoading: isAccountLoading, isRefetching: isRefetchingAccount, refetch: refetchAccount } = useAccountStatus();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6 pb-20">
      <div className="max-w-7xl mx-auto space-y-6">
        <DashboardHeader refetch={refetchAccount} isRefreshing={isAccountLoading || isRefetchingAccount} />

        <StatCards accountStatus={accountStatus!} isAccountLoading={isAccountLoading} />

        <div className="grid gap-6 grid-cols-1">
          <PerformanceOverview accountStatus={accountStatus} isLoading={isAccountLoading} />
        </div>

        <div className="grid grid-cols-1 gap-6">
          <IncomeChart title="Income Performance" height={350} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
