import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BotsStatus, BotsGrid } from "./components/bots";
import { SubscriptionsStatus, SubscriptionsGrid } from "./components/subscriptions";
import { useBots } from "@/features/bot/hooks/use-bot";
import { useGetBotSubscriptions } from "@/features/bot-subscription/hooks/use-bot-subscription";
import { RoleTypes } from "@/features/user/interfaces/user.interface";
import { useAuthStore } from "@/stores/auth.store";

const BotsPage = () => {
  const { role } = useAuthStore();
  const isUser = role === RoleTypes.user;

  const { data: bots, isLoading: isLoadingBots, refetch: refetchBots, isRefetching: isRefetchingBots } = useBots(isUser ? { visible: true } : undefined);
  const { data: subscriptions, isLoading: isLoadingSubscriptions, refetch: refetchSubscriptions, isRefetching: isRefetchingSubscriptions } = useGetBotSubscriptions();

  return (
    <div className="space-y-6 p-4 pb-20">
      <div className="max-w-7xl mx-auto space-y-6">
        <BotsStatus bots={bots || []} className={isUser ? "hidden" : ""} />

        <Tabs defaultValue="bots" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="bots">Trading Bots</TabsTrigger>
            <TabsTrigger value="subscriptions">My Subscriptions</TabsTrigger>
          </TabsList>

          <TabsContent value="bots" className="space-y-6">
            <BotsGrid bots={bots || []} isLoading={isLoadingBots} isRefetching={isRefetchingBots} refetch={refetchBots} />
          </TabsContent>

          <TabsContent value="subscriptions" className="space-y-6">
            <SubscriptionsStatus subscriptions={subscriptions || []} />
            <SubscriptionsGrid subscriptions={subscriptions || []} isLoading={isLoadingSubscriptions} isRefetching={isRefetchingSubscriptions} refetch={refetchSubscriptions} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default BotsPage;
