import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useAccountTrades } from "@/features/account/hooks/use-account";
import { BotTrades } from "./components/BotTrades";
import { BotInfo } from "./components/BotInfo";
import { BotControls } from "./components/BotControls";
import { Button } from "@/components/ui/button";
import type { Bot } from "@/features/bot/interfaces/bot.interface";

const BotPage = () => {
  const navigate = useNavigate();
  const { data: trades, isLoading: isTradesLoading } = useAccountTrades();

  const [isRunning, setIsRunning] = useState(true);

  const botData: Bot = {
    id: "1",
    active: true,
    created_at: "2024-01-15T10:30:00Z",
    quantity: 10,
    amount: 42350.75,
    interval: "5m",
    profit: 1250.89,
    symbol: "BTCUSDT",
    leverage: 10,
  };

  const handleStartStop = () => {
    setIsRunning(!isRunning);
  };

  const handleDelete = () => {
    console.log("Delete bot requested");
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")} className="mb-2">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Dashboard
      </Button>

      <BotControls isRunning={isRunning} onStartStop={handleStartStop} onDelete={handleDelete} symbol={botData.symbol} />

      <BotInfo bot={botData} />

      <BotTrades trades={trades} isLoading={isTradesLoading} />
    </div>
  );
};

export default BotPage;
