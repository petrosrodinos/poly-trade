import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Power } from "lucide-react";
import type { Bot } from "@/features/bot/interfaces/bot.interface";
import { CreateBotSubscriptionModal } from "./CreateBotSubscriptionModal";

interface ActiveBotPromptProps {
  bot: Bot;
}

export const ActiveBotPrompt = ({ bot }: ActiveBotPromptProps) => {
  const { symbol } = bot;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleActivateBot = () => {
    setIsModalOpen(true);
  };

  return (
    <Card className="border-2 border-dashed border-muted-foreground/20 bg-muted/10">
      <CardHeader className="text-center pb-4">
        <div className="flex justify-center mb-4">
          <div className="p-4 rounded-full bg-muted">
            <Power className="h-8 w-8 text-muted-foreground" />
          </div>
        </div>
        <CardTitle className="text-xl text-muted-foreground">Active Bot</CardTitle>
        <CardDescription className="text-center max-w-md mx-auto">Activate {symbol} to start automated trading based on your configured strategy.</CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <Button onClick={handleActivateBot} size="lg" className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white shadow-green-500/20 shadow-lg transition-all duration-200">
          <Play className="mr-2 h-4 w-4" />
          Activate Bot
        </Button>
        <p className="text-xs text-muted-foreground mt-4">Once activated, the bot will start monitoring market conditions and executing trades automatically.</p>
      </CardContent>
      <CreateBotSubscriptionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </Card>
  );
};
