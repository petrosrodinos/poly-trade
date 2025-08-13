import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { BotTrades } from "./components/BotTrades";
import { BotInfo } from "./components/BotInfo";
import { BotControls } from "./components/BotControls";
import { BotNotFound } from "./components/bot-not-found";
import { Button } from "@/components/ui/button";
import type { Bot } from "@/features/bot/interfaces/bot.interface";
import { useBot } from "@/features/bot/hooks/use-bot";

const BotPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: bot, isLoading: isBotLoading, refetch: refetchBot, isRefetching: isRefetchingBot, error } = useBot(id || "");

  if (!isBotLoading && (!bot || error)) {
    return <BotNotFound />;
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")} className="mb-2">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Dashboard
      </Button>

      <BotControls bot={bot || ({} as Bot)} isLoading={isBotLoading} refetch={refetchBot} isRefetching={isRefetchingBot} />

      <BotInfo bot={bot || ({} as Bot)} isLoading={isBotLoading} />

      <BotTrades trades={bot?.trades || []} isLoading={isBotLoading} />
    </div>
  );
};

export default BotPage;
