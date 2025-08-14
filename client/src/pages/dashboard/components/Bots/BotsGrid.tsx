import { useState } from "react";
import { BotIcon, Plus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BotCard } from "./BotCard";
import type { Bot } from "@/features/bot/interfaces/bot.interface";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/stores/auth.store";
import { RoleTypes } from "@/features/user/interfaces/user.interface";
import { CreateBotModal } from "./CreateBotModal";

interface BotsGridProps {
  bots: Bot[];
  isLoading: boolean;
  isRefetching: boolean;
  refetch: () => void;
}

export const BotsGrid = ({ bots, isLoading, isRefetching, refetch }: BotsGridProps) => {
  const { role } = useAuthStore();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Trading Bots</h2>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={refetch} disabled={isRefetching} className="shrink-0">
            <RefreshCw size={20} className={isRefetching ? "animate-spin" : ""} />
          </Button>
          {role === RoleTypes.admin && (
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus size={20} />
              Create New Bot
            </Button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <Skeleton key={index} className="w-full h-32" />
          ))}
        </div>
      ) : bots && bots.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bots.map((bot) => (
            <BotCard key={bot.id} bot={bot} />
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <CardContent className="pt-6">
            <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
              <BotIcon size={32} className="text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No trading bots yet</h3>
            {role === RoleTypes.admin && (
              <Button onClick={() => setIsCreateModalOpen(true)}>
                <Plus size={20} />
                Create Your First Bot
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      <CreateBotModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
    </div>
  );
};
