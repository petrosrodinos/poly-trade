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
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-4xl font-bold">Trading Dashboard</h1>
        <p className="text-muted-foreground mt-2">Monitor your trading performance and manage your bots</p>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing} className="flex items-center gap-2">
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>
    </div>
  );
};
