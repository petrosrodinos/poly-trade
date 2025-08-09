import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: LucideIcon;
  gradientFrom: string;
  gradientTo: string;
  isLoading?: boolean;
}

export const StatCard = ({ title, value, subtitle, icon: Icon, gradientFrom, gradientTo, isLoading = false }: StatCardProps) => {
  return (
    <Card className={`border-0 shadow-lg bg-gradient-to-br ${gradientFrom} ${gradientTo} text-white`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium opacity-90">{title}</CardTitle>
        <Icon className="h-4 w-4 opacity-90" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold flex items-center gap-2">
          {isLoading ? (
            <>
              <Spinner size="sm" className="text-white" />
              <span className="text-lg">Loading...</span>
            </>
          ) : (
            value
          )}
        </div>
        <p className="text-xs opacity-90 mt-1">{subtitle}</p>
      </CardContent>
    </Card>
  );
};
