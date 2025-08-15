import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Power, Ban } from "lucide-react";
import type { Bot } from "@/features/bot/interfaces/bot.interface";
import { CreateBotSubscriptionModal } from "./CreateBotSubscriptionModal";

interface ActiveBotPromptProps {
  bot: Bot;
}

export const ActiveBotPrompt = ({ bot }: ActiveBotPromptProps) => {
  const { symbol, active } = bot;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleActivateBot = () => {
    if (active) {
      setIsModalOpen(true);
    }
  };

  const isDisabled = !active;

  return (
    <Card className="border-2 border-dashed border-muted-foreground/20 bg-muted/10">
      <CardHeader className="text-center pb-4">
        <div className="flex justify-center mb-4">
          <div className={`p-4 rounded-full ${isDisabled ? "bg-red-100 dark:bg-red-950" : "bg-muted"}`}>{isDisabled ? <Ban className="h-8 w-8 text-red-500" /> : <Power className="h-8 w-8 text-muted-foreground" />}</div>
        </div>
        <CardTitle className={`text-xl ${isDisabled ? "text-red-500" : "text-muted-foreground"}`}>{isDisabled ? "Bot Disabled" : "Activate Bot"}</CardTitle>
        <CardDescription className="text-center max-w-md mx-auto">{isDisabled ? `${symbol} bot is currently disabled by admin and cannot be activated.` : `Activate ${symbol} to start automated trading based on your configured strategy.`}</CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <Button onClick={handleActivateBot} size="lg" disabled={isDisabled} className={`w-full sm:w-auto transition-all duration-200 ${isDisabled ? "bg-gray-400 hover:bg-gray-400 text-gray-600 cursor-not-allowed shadow-none" : "bg-green-500 hover:bg-green-600 text-white shadow-green-500/20 shadow-lg"}`}>
          <Play className="mr-2 h-4 w-4" />
          {isDisabled ? "Bot Disabled" : "Activate Bot"}
        </Button>
        <p className="text-xs text-muted-foreground mt-4">{isDisabled ? "This bot has been disabled by an administrator." : "Once activated, the bot will start monitoring market conditions and executing trades automatically."}</p>
      </CardContent>
      {active && <CreateBotSubscriptionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />}
    </Card>
  );
};
