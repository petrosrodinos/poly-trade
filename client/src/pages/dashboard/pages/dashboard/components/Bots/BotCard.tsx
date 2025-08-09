import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot as BotIcon, Calendar, Clock, DollarSign, Hash, Scale, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Routes } from "@/routes/routes";
import type { Bot } from "@/features/bot/interfaces/bot.interface";

interface BotCardProps {
  bot: Bot;
  onToggle?: (botId: string) => void;
}

export const BotCard = ({ bot }: BotCardProps) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(Routes.dashboard.bot(bot.id));
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusBadgeVariant = (active: boolean) => {
    return active ? "default" : "secondary";
  };

  const getStatusColor = (active: boolean) => {
    return active ? "text-green-600" : "text-gray-500";
  };

  const getProfitColor = (profit: number) => {
    if (profit > 0) return "text-green-600";
    if (profit < 0) return "text-red-600";
    return "text-gray-500";
  };

  return (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer hover:scale-[1.02] hover:bg-gray-50/50" onClick={handleCardClick}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-lg">
            <BotIcon className="w-5 h-5 mr-2" />
            {bot.symbol}
          </CardTitle>
          <Badge variant={getStatusBadgeVariant(bot.active)} className={getStatusColor(bot.active)}>
            {bot.active ? "Active" : "Inactive"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            <span className={`font-semibold ${getProfitColor(bot.profit)}`}>{formatCurrency(bot.profit)}</span>
          </div>

          <div className="flex items-center space-x-2">
            <DollarSign className="w-4 h-4 text-green-500" />
            <span className="font-semibold">{formatCurrency(bot.amount)}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center space-x-2">
            <Hash className="w-4 h-4 text-indigo-500" />
            <span className="font-semibold">{bot.quantity.toLocaleString()}</span>
          </div>

          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-purple-500" />
            <span className="font-semibold">{bot.interval}</span>
          </div>

          <div className="flex items-center space-x-2">
            <Scale className="w-4 h-4 text-orange-500" />
            <span className="font-semibold">{bot.leverage}x</span>
          </div>

          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-orange-500" />
            <span className="font-semibold">{formatDate(bot.created_at)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
