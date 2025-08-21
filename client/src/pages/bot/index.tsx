import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { BotTrades } from "./components/BotTrades";
import { BotInfo } from "./components/BotInfo";
import { BotControls } from "./components/BotControls";
import { AdminBotControls } from "./components/admin-bot-controls";
import { BotNotFound } from "./components/bot-not-found";
import { BotLoadingSkeleton } from "./components/bot-loading-skeleton";
import { Button } from "@/components/ui/button";
import type { Bot } from "@/features/bot/interfaces/bot.interface";
import { useBot } from "@/features/bot/hooks/use-bot";
import { ActiveBotPrompt } from "./components/activate-bot";
import { useAuthStore } from "@/stores/auth.store";
import { RoleTypes } from "@/features/user/interfaces/user.interface";
import { useBotSubscriptionByBotUuid } from "@/features/bot-subscription/hooks/use-bot-subscription";
import type { BotSubscription } from "@/features/bot-subscription/interfaces/bot-subscription.interface";
import { Routes } from "@/routes/routes";

const BotPage = () => {
  const navigate = useNavigate();
  const { uuid } = useParams();
  const { role } = useAuthStore();

  const { data: bot, isLoading: isBotLoading, refetch: refetchBot, error, isRefetching: isRefetchingBot } = useBot(uuid || "");
  const { data: botSubscription, isLoading: isBotSubscriptionLoading, refetch: refetchBotSubscription, isRefetching: isRefetchingBotSubscription } = useBotSubscriptionByBotUuid(uuid || "");

  const isAdmin = role === RoleTypes.admin;

  if (!isBotLoading && (!bot || error)) {
    return <BotNotFound />;
  }

  const handleRefetch = () => {
    refetchBot();
    refetchBotSubscription();
  };

  const isLoading = isBotLoading || isBotSubscriptionLoading;

  const isRefetching = isRefetchingBotSubscription || isRefetchingBot;

  if (isLoading) {
    return <BotLoadingSkeleton isAdmin={isAdmin} />;
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6 pb-40">
      <Button variant="ghost" size="sm" onClick={() => navigate(Routes.bots.root)} className="mb-2">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      {bot && (
        <>
          {isAdmin && <AdminBotControls bot={bot || ({} as Bot)} isLoading={false} />}
          {!botSubscription ? (
            <ActiveBotPrompt bot={bot!} />
          ) : (
            <>
              <BotControls bot_subscription={botSubscription || ({} as BotSubscription)} bot={bot || ({} as Bot)} isLoading={false} refetch={handleRefetch} isRefetching={isRefetching} />
              <BotInfo bot={bot || ({} as Bot)} bot_subscription={botSubscription || ({} as BotSubscription)} isLoading={false} />
              <BotTrades trades={botSubscription?.trades || []} isLoading={false} />
              <div className="h-20"></div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default BotPage;
