import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Shield, ArrowLeft } from "lucide-react";

interface BotLoadingSkeletonProps {
  isAdmin?: boolean;
}

export const BotLoadingSkeleton = ({ isAdmin = false }: BotLoadingSkeletonProps) => {
  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6 pb-20">
      <div className="flex items-center gap-2 mb-2">
        <ArrowLeft className="h-4 w-4 text-muted-foreground" />
        <Skeleton className="h-4 w-12" />
      </div>

      {isAdmin && (
        <Card className="p-4 bg-gradient-to-r from-orange-50/50 to-amber-50/50 dark:from-orange-950/20 dark:to-amber-950/20 border-orange-200 dark:border-orange-800 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              <Skeleton className="h-6 w-32" />
            </div>
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-20" />
            </div>
          </div>
        </Card>
      )}

      <Card className="p-4 bg-gradient-to-r from-muted/20 to-muted/40 border shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex items-center gap-2">
              <Skeleton className="w-3 h-3 rounded-full" />
              <Skeleton className="h-6 w-20" />
            </div>
            <Separator orientation="vertical" className="h-6 hidden sm:block" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-20" />
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-8 w-16" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-3 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="h-fit">
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <Skeleton className="h-6 w-32" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-20" />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-3">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                  <div className="flex-1 min-w-0">
                    <Skeleton className="h-4 w-20 mb-1" />
                    <Skeleton className="h-3 w-28" />
                  </div>
                  <Skeleton className="h-5 w-12 rounded-full" />
                </div>
                <div className="flex flex-col gap-1 sm:block sm:text-right">
                  <Skeleton className="h-4 w-16 mb-1" />
                  <Skeleton className="h-3 w-12 mb-1" />
                  <Skeleton className="h-3 w-14" />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-center gap-2">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-16" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
