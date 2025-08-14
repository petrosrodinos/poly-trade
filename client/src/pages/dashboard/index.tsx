import { useAccountStatus } from "@/features/account/hooks/use-account";
import { DashboardHeader, BotsStatus, BotsGrid } from "./components";
import { StatCards } from "./components/Stats/StatCards";
import { PerformanceOverview } from "./components/PerformanceOverview";
import { useBots } from "@/features/bot/hooks/use-bot";
import { IncomeChart } from "./components/IncomeChart";
import { useAuthStore } from "@/stores/auth.store";
import { RoleTypes } from "@/features/user/interfaces/user.interface";

const DashboardPage = () => {
  const { data: accountStatus, isLoading: isAccountLoading, isRefetching: isRefetchingAccount, refetch: refetchAccount } = useAccountStatus();
  const { data: bots, isLoading: isLoading, refetch, isRefetching: isRefetchingBots } = useBots();
  const { role } = useAuthStore();
  const isUser = role === RoleTypes.user;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <DashboardHeader refetch={refetchAccount} isRefreshing={isAccountLoading || isLoading || isRefetchingAccount} />

        <StatCards accountStatus={accountStatus!} isAccountLoading={isAccountLoading} />

        <div className={`grid gap-6 ${isUser ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-3"}`}>
          <PerformanceOverview accountStatus={accountStatus} isLoading={isAccountLoading} className={isUser ? "col-span-1" : ""} />
          <BotsStatus bots={bots || []} className={isUser ? "hidden" : ""} />
        </div>

        <div className="grid grid-cols-1 gap-6">
          <IncomeChart title="Income Performance" height={350} />
        </div>

        <BotsGrid bots={bots || []} isLoading={isLoading} isRefetching={isRefetchingBots} refetch={refetch} />
      </div>
    </div>
  );
};

export default DashboardPage;
