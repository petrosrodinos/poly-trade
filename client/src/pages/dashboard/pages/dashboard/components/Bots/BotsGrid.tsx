import { BotCard } from "./BotCard";

interface Bot {
  id: string;
  active: boolean;
  symbol: string;
  created_at: string;
  interval: string;
  amount: number;
  quantity: number;
  profit: number;
  exchange?: "binance" | "alpaca";
}

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
    exchange: "binance",
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
    exchange: "alpaca",
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
    exchange: "binance",
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
    exchange: "binance",
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
    exchange: "alpaca",
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
    exchange: "binance",
  },
];

export const BotsGrid = () => {
  const activeBots = mockBots.filter((bot) => bot.active).length;
  const totalProfit = mockBots.reduce((sum, bot) => sum + bot.profit, 0);

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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockBots.map((bot) => (
          <BotCard key={bot.id} bot={bot} />
        ))}
      </div>
    </div>
  );
};
