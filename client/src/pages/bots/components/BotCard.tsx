import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot as BotIcon, Clock, DollarSign, Hash, Scale, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Routes } from "@/routes/routes";
import type { Bot } from "@/features/bot/interfaces/bot.interface";

interface BotCardProps {
  bot: Bot;
  onToggle?: (botId: string) => void;
}

export const BotCard = ({ bot }: BotCardProps) => {
  const navigate = useNavigate();

  const { symbol, active } = bot;

  const handleCardClick = () => {
    navigate(Routes.bots.bot(bot.uuid));
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(value);
  };

  const getProfitColor = (profit: number) => {
    if (profit > 0) return "text-green-600";
    if (profit < 0) return "text-destructive";
    return "text-muted-foreground";
  };

  return (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer hover:scale-[1.02] hover:bg-muted/10" onClick={handleCardClick}>
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <CardTitle className="flex items-center text-lg">
            <BotIcon className="w-5 h-5 mr-2" />
            {symbol}
          </CardTitle>
          <div className="flex justify-start sm:justify-end">
            <Badge variant={active ? "default" : "secondary"} className={`text-xs sm:text-sm px-2 sm:px-3 py-1 font-medium ${active ? "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800" : "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"}`}>
              {active ? "Enabled" : "Disabled"}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            <span className={`font-semibold ${getProfitColor(bot.profit || 0)}`}>{formatCurrency(bot.profit || 0)}</span>
          </div>

          <div className="flex items-center space-x-2">
            <DollarSign className="w-4 h-4 text-green-500" />
            <span className="font-semibold">{formatCurrency(bot?.amount || 0)}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center space-x-2">
            <Hash className="w-4 h-4 text-indigo-500" />
            <span className="font-semibold">{bot?.quantity?.toLocaleString() || "-"}</span>
          </div>

          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-purple-500" />
            <span className="font-semibold">{bot.timeframe}</span>
          </div>

          <div className="flex items-center space-x-2">
            <Scale className="w-4 h-4 text-orange-500" />
            <span className="font-semibold">{bot?.leverage || "-"}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
