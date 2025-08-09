import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Square, Bot as BotIcon } from "lucide-react";
import type { Bot } from "@/features/bot/interfaces/bot.interface";

interface BotsStatusProps {
  bots: Bot[];
}

export const BotsStatus = ({ bots }: BotsStatusProps) => {
  const runningBots = bots.filter((bot) => bot.active).length;
  const totalBots = bots.length;
  const totalActiveSymbols = bots.reduce((sum, bot) => sum + (bot.active ? 1 : 0), 0);

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center">
          <BotIcon className="w-5 h-5 mr-2" />
          Trading Bots Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-3 gap-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{runningBots}</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Running</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{totalBots}</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Total Bots</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{totalActiveSymbols}</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Active Symbols</div>
          </div>
        </div>

        <div className="pt-4 space-y-2">
          <Button className="w-full bg-green-600 hover:bg-green-700 text-white" size="sm">
            <Play className="w-4 h-4 mr-2 " />
            Start All Bots
          </Button>
          <Button className="w-full bg-red-600 hover:bg-red-700 text-white" size="sm">
            <Square className="w-4 h-4 mr-2" />
            Stop All Bots
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
