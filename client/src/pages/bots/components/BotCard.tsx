import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot as BotIcon, Clock, Key, Copy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Routes } from "@/routes/routes";
import type { Bot } from "@/features/bot/interfaces/bot.interface";
import { useAuthStore } from "@/stores/auth.store";
import { RoleTypes } from "@/features/user/interfaces/user.interface";

interface BotCardProps {
  bot: Bot;
  onToggle?: (botId: string) => void;
}

export const BotCard = ({ bot }: BotCardProps) => {
  const navigate = useNavigate();
  const { role } = useAuthStore();

  const { symbol, active, uuid, visible } = bot;
  const isAdmin = role === RoleTypes.admin;

  const handleCardClick = () => {
    navigate(Routes.bots.bot(bot.uuid));
  };

  const handleCopyUuid = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(uuid);
  };

  // const formatCurrency = (value: number) => {
  //   return new Intl.NumberFormat("en-US", {
  //     style: "currency",
  //     currency: "USD",
  //     minimumFractionDigits: 2,
  //   }).format(value);
  // };

  return (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer hover:scale-[1.02] hover:bg-muted/10" onClick={handleCardClick}>
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <CardTitle className="flex items-center text-lg">
            <BotIcon className="w-5 h-5 mr-2" />
            {symbol}
          </CardTitle>
          <div className="flex justify-start sm:justify-end space-x-2">
            <Badge variant={active ? "default" : "secondary"} className={`text-xs sm:text-sm px-2 sm:px-3 py-1 font-medium ${active ? "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800" : "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"}`}>
              {active ? "Enabled" : "Disabled"}
            </Badge>
            {!visible && isAdmin && (
              <Badge variant="outline" className="text-xs sm:text-sm px-2 sm:px-3 py-1 font-medium bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-700">
                Hidden
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-purple-500" />
            <span className="font-semibold">{bot.timeframe}</span>
          </div>
        </div>

        {isAdmin && (
          <div className="border-t pt-3 mt-3">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <Key className="w-3 h-3 text-slate-500" />
                <span className="text-slate-500 font-mono">{uuid}</span>
              </div>
              <button onClick={handleCopyUuid} className="flex items-center justify-center w-6 h-6 rounded hover:bg-muted/50 transition-colors" title="Copy UUID">
                <Copy className="w-3 h-3 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300" />
              </button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
