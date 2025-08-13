import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { Play, Square, Bot as BotIcon } from "lucide-react";
import { useState } from "react";
import type { Bot } from "@/features/bot/interfaces/bot.interface";
import { useStartAllBots, useStopAllBots } from "@/features/bot/hooks/use-bot";

interface BotsStatusProps {
  bots: Bot[];
}

export const BotsStatus = ({ bots }: BotsStatusProps) => {
  const { mutate: startAllBots, isPending: isStartingAllBots } = useStartAllBots();
  const { mutate: stopAllBots, isPending: isStoppingAllBots } = useStopAllBots();

  const [showStartDialog, setShowStartDialog] = useState(false);
  const [showStopDialog, setShowStopDialog] = useState(false);

  const runningBots = bots.filter((bot) => bot.active).length;
  const totalBots = bots.length;
  const totalActiveSymbols = bots.reduce((sum, bot) => sum + (bot.active ? 1 : 0), 0);

  const handleStartAllBots = () => {
    startAllBots();
    setShowStartDialog(false);
  };

  const handleStopAllBots = () => {
    stopAllBots();
    setShowStopDialog(false);
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center">
          <BotIcon className="w-5 h-5 mr-2" />
          Trading Bots Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{runningBots}</div>
            <div className="text-sm text-muted-foreground">Running</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{totalBots}</div>
            <div className="text-sm text-muted-foreground">Total Bots</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{totalActiveSymbols}</div>
            <div className="text-sm text-muted-foreground">Active Symbols</div>
          </div>
        </div>

        <div className="pt-4 space-y-2">
          <Button onClick={() => setShowStartDialog(true)} disabled={runningBots === totalBots || isStartingAllBots || isStoppingAllBots} className="w-full bg-green-600 hover:bg-green-700 text-white" size="sm">
            <Play className={`w-4 h-4 mr-2 ${isStartingAllBots ? "animate-spin" : ""}`} />
            Start All Bots
          </Button>
          <Button onClick={() => setShowStopDialog(true)} disabled={runningBots === 0 || isStartingAllBots || isStoppingAllBots} className="w-full bg-red-600 hover:bg-red-700 text-white" size="sm">
            <Square className={`w-4 h-4 mr-2 ${isStoppingAllBots ? "animate-spin" : ""}`} />
            Stop All Bots
          </Button>
        </div>
      </CardContent>

      <ConfirmationDialog isOpen={showStartDialog} onClose={() => setShowStartDialog(false)} onConfirm={handleStartAllBots} title="Start All Bots" description={`Are you sure you want to start all ${totalBots - runningBots} inactive trading bots? This will begin automated trading on all configured symbols.`} confirmText="Start All Bots" cancelText="Cancel" variant="default" isLoading={isStartingAllBots} />

      <ConfirmationDialog isOpen={showStopDialog} onClose={() => setShowStopDialog(false)} onConfirm={handleStopAllBots} title="Stop All Bots" description={`Are you sure you want to stop all ${runningBots} running trading bots? This will halt all automated trading activities and close any open positions.`} confirmText="Stop All Bots" cancelText="Cancel" variant="destructive" isLoading={isStoppingAllBots} />
    </Card>
  );
};
