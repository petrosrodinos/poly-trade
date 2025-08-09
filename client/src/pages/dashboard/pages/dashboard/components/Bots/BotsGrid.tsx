import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BotCard } from "./BotCard";
import { CreateBotModal } from "./CreateBotModal";
import type { Bot } from "@/features/bot/interfaces/bot.interface";

interface BotsGridProps {
  bots: Bot[];
}

export const BotsGrid = ({ bots }: BotsGridProps) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const activeBots = bots?.filter((bot) => bot.active).length;
  const totalProfit = bots?.reduce((sum, bot) => sum + (bot.profit || 0), 0) || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Trading Bots</h2>
          <p className="text-gray-600 dark:text-gray-400">
            {activeBots} of {bots?.length} bots active • Total P&L:{" "}
            <span className={totalProfit >= 0 ? "text-green-600" : "text-red-600"}>
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 2,
              }).format(totalProfit || 0)}
            </span>
          </p>
        </div>

        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus size={20} />
          Create New Bot
        </Button>
      </div>

      {bots && bots.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bots.map((bot) => (
            <BotCard key={bot.id} bot={bot} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border border-gray-200 dark:border-gray-700 rounded-lg">
          <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
            <Plus size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No trading bots yet</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Get started by creating your first trading bot to automate your trades.</p>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus size={20} />
            Create Your First Bot
          </Button>
        </div>
      )}

      <CreateBotModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
    </div>
  );
};
