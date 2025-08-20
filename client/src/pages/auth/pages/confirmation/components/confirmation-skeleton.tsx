import type { FC } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const ConfirmationSkeleton: FC = () => (
  <Card className="w-full max-w-md mx-auto">
    <CardHeader className="text-center space-y-4">
      <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
        <Skeleton className="w-8 h-8 rounded-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-6 w-48 mx-auto" />
        <Skeleton className="h-4 w-64 mx-auto" />
      </div>
    </CardHeader>

    <CardContent className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-start space-x-3 p-3 sm:p-4 bg-muted/50 rounded-lg">
          <Skeleton className="w-5 h-5 rounded-full flex-shrink-0" />
          <div className="space-y-1 min-w-0 flex-1">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-32" />
          </div>
        </div>

        <div className="p-3 sm:p-4 bg-muted/50 rounded-lg">
          <div className="flex items-start space-x-3">
            <Skeleton className="w-5 h-5 rounded-full flex-shrink-0" />
            <div className="space-y-1 min-w-0 flex-1">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-3 w-40" />
            </div>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default ConfirmationSkeleton;
