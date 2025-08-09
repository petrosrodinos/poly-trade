import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Square, Bot } from "lucide-react";

interface BotData {
  id: string;
  name: string;
  status: "running" | "stopped" | "paused" | "error";
  exchange: "binance" | "alpaca";
  activeSymbols: number;
  uptime: string;
  profit24h: number;
  totalTrades: number;
}

const mockBots: BotData[] = [
  {
    id: "1",
    name: "Crypto Scalper",
    status: "running",
    exchange: "binance",
    activeSymbols: 5,
    uptime: "2h 34m",
    profit24h: 234.56,
    totalTrades: 23,
  },
  {
    id: "2",
    name: "Stock Momentum",
    status: "running",
    exchange: "alpaca",
    activeSymbols: 3,
    uptime: "1h 12m",
    profit24h: -45.2,
    totalTrades: 8,
  },
  {
    id: "3",
    name: "DCA Bot",
    status: "stopped",
    exchange: "binance",
    activeSymbols: 0,
    uptime: "0h 0m",
    profit24h: 0,
    totalTrades: 0,
  },
  {
    id: "4",
    name: "Arbitrage Hunter",
    status: "paused",
    exchange: "binance",
    activeSymbols: 2,
    uptime: "4h 45m",
    profit24h: 89.12,
    totalTrades: 15,
  },
  {
    id: "5",
    name: "Grid Trader",
    status: "error",
    exchange: "alpaca",
    activeSymbols: 0,
    uptime: "0h 0m",
    profit24h: -12.34,
    totalTrades: 2,
  },
];

export const BotsStatus = () => {
  const runningBots = mockBots.filter((bot) => bot.status === "running").length;
  const totalBots = mockBots.length;
  const totalActiveSymbols = mockBots.reduce((sum, bot) => sum + bot.activeSymbols, 0);

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Bot className="w-5 h-5 mr-2" />
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
