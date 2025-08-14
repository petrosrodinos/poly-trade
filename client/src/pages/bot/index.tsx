import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { BotTrades } from "./components/BotTrades";
import { BotInfo } from "./components/BotInfo";
import { BotControls } from "./components/BotControls";
import { AdminBotControls } from "./components/admin-bot-controls";
import { BotNotFound } from "./components/bot-not-found";
import { Button } from "@/components/ui/button";
import type { Bot } from "@/features/bot/interfaces/bot.interface";
import { useBot } from "@/features/bot/hooks/use-bot";
import { ActiveBotPrompt } from "./components/active-bot-prompt";
import { useAuthStore } from "@/stores/auth.store";
import { RoleTypes } from "@/features/user/interfaces/user.interface";
import { useBotSubscriptionByBotUuid } from "@/features/bot-subscription/hooks/use-bot-subscription";
import type { BotSubscription } from "@/features/bot-subscription/interfaces/bot-subscription.interface";

const BotPage = () => {
  const navigate = useNavigate();
  const { uuid } = useParams();
  const { role } = useAuthStore();

  const { data: bot, isLoading: isBotLoading, refetch: refetchBot, error } = useBot(uuid || "");
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

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")} className="mb-2">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Dashboard
      </Button>

      {bot && (
        <>
          {!isLoading && !botSubscription?.enabled ? (
            <ActiveBotPrompt bot={bot!} />
          ) : (
            <>
              <BotControls bot_subscription={botSubscription || ({} as BotSubscription)} bot={bot || ({} as Bot)} isLoading={isLoading} refetch={handleRefetch} isRefetching={isRefetchingBotSubscription} />
              {isAdmin && <AdminBotControls bot={bot || ({} as Bot)} isLoading={isLoading} />}
              <BotInfo bot={bot || ({} as Bot)} bot_subscription={botSubscription || ({} as BotSubscription)} isLoading={isLoading} />
              <BotTrades trades={botSubscription?.trades || []} isLoading={isLoading} />
            </>
          )}
        </>
      )}
    </div>
  );
};

export default BotPage;
