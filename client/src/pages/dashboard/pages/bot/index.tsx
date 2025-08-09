import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useFormatters } from "../../hooks";
import { useAccountTrades } from "@/features/account/hooks/use-account";
import { BotTrades } from "./components/BotTrades";
import { BotInfo } from "./components/BotInfo";
import { BotControls } from "./components/BotControls";
import { Button } from "@/components/ui/button";

const BotPage = () => {
  const navigate = useNavigate();
  const { data: trades, isLoading: isTradesLoading } = useAccountTrades();
  const { formatCurrency, formatTimestamp } = useFormatters();

  const [isRunning, setIsRunning] = useState(true);

  const botData = {
    quantity: 10,
    price: 42350.75,
    interval: "5m",
    profit: 1250.89,
    symbol: "BTCUSDT",
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

      <BotInfo quantity={botData.quantity} price={botData.price} interval={botData.interval} profit={botData.profit} formatCurrency={formatCurrency} />

      <BotTrades trades={trades} isLoading={isTradesLoading} formatCurrency={formatCurrency} formatTimestamp={formatTimestamp} />
    </div>
  );
};

export default BotPage;
