import { Users, Bot, CheckCircle, DollarSign } from "lucide-react";
import { useAdminStats } from "@/features/admin/hooks/use-admin";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
  className?: string;
}

const StatsCard = ({ title, value, icon: Icon, description, className }: StatsCardProps) => (
  <div className={`bg-card text-card-foreground rounded-lg border p-6 shadow-sm transition-all hover:shadow-md ${className}`}>
    <div className="flex items-center justify-between">
      <div className="space-y-1">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </div>
      <div className="rounded-full bg-primary/10 p-3">
        <Icon className="h-6 w-6 text-primary" />
      </div>
    </div>
  </div>
);

const AdminStats = () => {
  const { data: stats, isLoading, error } = useAdminStats();

  if (isLoading) {
    return (
      <div className="space-y-6 p-4 pb-20">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">Overview of platform statistics and user activity</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-card rounded-lg border p-6 shadow-sm animate-pulse">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-20"></div>
                  <div className="h-8 bg-muted rounded w-16"></div>
                  <div className="h-3 bg-muted rounded w-24"></div>
                </div>
                <div className="rounded-full bg-muted h-12 w-12"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 p-4 pb-20">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">Overview of platform statistics and user activity</p>
        </div>
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6">
          <p className="text-destructive font-medium">Error loading admin statistics</p>
          <p className="text-destructive/80 text-sm mt-1">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const enabledPercentage = stats.total_users > 0 ? Math.round((stats.enabled_users / stats.total_users) * 100) : 0;

  return (
    <div className="space-y-6 p-4 pb-20">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">Overview of platform statistics and user activity</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatsCard title="Users Status" value={`${stats.enabled_users}/${stats.total_users}`} icon={Users} description={`${enabledPercentage}% enabled users`} />

        <StatsCard title="Bot Subscriptions" value={stats.bot_subscriptions_count} icon={Bot} description="Active subscriptions" />

        <StatsCard title="Commission" value={stats.verified_users} icon={DollarSign} description="Total commission" className="md:col-span-2 lg:col-span-1" />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="bg-card text-card-foreground rounded-lg border p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-full bg-green-100 dark:bg-green-900/20 p-2">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-semibold">User Activity</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Enabled Users</span>
              <span className="font-medium">{stats.enabled_users}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Verified Users</span>
              <span className="font-medium">{stats.verified_users}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStats;
