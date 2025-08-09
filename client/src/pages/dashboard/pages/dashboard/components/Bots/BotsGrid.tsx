import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BotCard } from "./BotCard";
import { CreateBotModal } from "./CreateBotModal";
import type { Bot, BotFormData } from "@/features/bot/interfaces/bot.interface";

const mockBots: Bot[] = [
  {
    id: "1",
    active: true,
    symbol: "BTCUSDT",
    created_at: "2024-01-15T10:30:00Z",
    interval: "1m",
    amount: 1000,
    quantity: 0.025,
    profit: 234.56,
    leverage: 10,
  },
  {
    id: "2",
    active: true,
    symbol: "AAPL",
    created_at: "2024-01-10T14:22:00Z",
    interval: "5m",
    amount: 2500,
    quantity: 15,
    profit: -45.2,
    leverage: 10,
  },
  {
    id: "3",
    active: false,
    symbol: "ETHUSDT",
    created_at: "2024-01-08T09:15:00Z",
    interval: "1h",
    amount: 500,
    quantity: 0.8,
    profit: 0,
    leverage: 10,
  },
  {
    id: "4",
    active: true,
    symbol: "ADAUSDT",
    created_at: "2024-01-12T16:45:00Z",
    interval: "15m",
    amount: 750,
    quantity: 1250,
    profit: 89.12,
    leverage: 10,
  },
  {
    id: "5",
    active: false,
    symbol: "TSLA",
    created_at: "2024-01-05T11:30:00Z",
    interval: "30m",
    amount: 1800,
    quantity: 8,
    profit: -12.34,
    leverage: 10,
  },
  {
    id: "6",
    active: true,
    symbol: "SOLUSDT",
    created_at: "2024-01-18T08:20:00Z",
    interval: "4h",
    amount: 1200,
    quantity: 12.5,
    profit: 156.78,
    leverage: 10,
  },
];

export const BotsGrid = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const activeBots = mockBots.filter((bot) => bot.active).length;
  const totalProfit = mockBots.reduce((sum, bot) => sum + bot.profit, 0);

  const handleCreateBot = (botData: BotFormData) => {
    console.log("Creating new bot:", botData);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Trading Bots</h2>
          <p className="text-gray-600 dark:text-gray-400">
            {activeBots} of {mockBots.length} bots active • Total P&L:{" "}
            <span className={totalProfit >= 0 ? "text-green-600" : "text-red-600"}>
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 2,
              }).format(totalProfit)}
            </span>
          </p>
        </div>

        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus size={20} />
          Create New Bot
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockBots.map((bot) => (
          <BotCard key={bot.id} bot={bot} />
        ))}
      </div>

      <CreateBotModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} onSubmit={handleCreateBot} />
    </div>
  );
};
