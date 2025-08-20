import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SubscriptionCard } from "./subscription-card";
import type { BotSubscription } from "@/features/bot-subscription/interfaces/bot-subscription.interface";
import { Skeleton } from "@/components/ui/skeleton";
import { BotIcon } from "lucide-react";

interface SubscriptionsGridProps {
  subscriptions: BotSubscription[];
  isLoading: boolean;
  isRefetching: boolean;
  refetch: () => void;
}

export const SubscriptionsGrid = ({ subscriptions, isLoading, isRefetching, refetch }: SubscriptionsGridProps) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start justify-between sm:block flex-1">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">My Bot Subscriptions</h2>
            <p className="text-sm text-muted-foreground">View and manage your active bot subscriptions. Click on a subscription to see detailed information.</p>
          </div>
          <Button variant="outline" size="icon" onClick={refetch} disabled={isRefetching} className="shrink-0 sm:hidden">
            <RefreshCw size={20} className={isRefetching ? "animate-spin" : ""} />
          </Button>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:gap-2">
          <Button variant="outline" onClick={refetch} disabled={isRefetching} className="shrink-0 self-start sm:self-auto hidden sm:flex">
            <RefreshCw size={20} className={`${isRefetching ? "animate-spin" : ""} mr-2`} />
            Refresh
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <Skeleton key={index} className="w-full h-32" />
          ))}
        </div>
      ) : subscriptions && subscriptions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subscriptions.map((subscription) => (
            <SubscriptionCard key={subscription.id} subscription={subscription} />
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <CardContent className="pt-6">
            <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
              <BotIcon size={32} className="text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No bot subscriptions yet</h3>
            <p className="text-sm text-muted-foreground">Subscribe to a bot from the Trading Bots page to start automated trading</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
