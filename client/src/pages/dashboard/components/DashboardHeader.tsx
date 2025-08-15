import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface DashboardHeaderProps {
  refetch?: () => void;
  isRefreshing?: boolean;
}

export const DashboardHeader = ({ refetch, isRefreshing }: DashboardHeaderProps) => {
  const handleRefresh = async () => {
    refetch?.();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Trading Dashboard</h1>
          <p className="text-muted-foreground text-sm sm:text-base">Monitor your trading performance and manage your bots</p>
        </div>
        <div className="hidden sm:flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing} className="flex items-center gap-2">
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>
      <div className="flex sm:hidden justify-start">
        <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing} className="flex items-center gap-2">
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>
    </div>
  );
};
