import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { BotFormData } from "@/features/bot/interfaces/bot.interface";

interface CreateBotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (botData: BotFormData) => void;
}

const CRYPTO_PAIRS = ["BTCUSDT", "ETHUSDT", "BNBUSDT", "XRPUSDT", "ADAUSDT", "SOLUSDT", "DOGEUSDT", "DOTUSDT", "AVAXUSDT", "MATICUSDT", "LTCUSDT", "ATOMUSDT", "LINKUSDT", "UNIUSDT", "ALGOUSDT", "VETUSDT", "FILUSDT", "TRXUSDT", "ETCUSDT", "XLMUSDT"];

const INTERVALS = [
  { value: "1m", label: "1 minute" },
  { value: "3m", label: "3 minutes" },
  { value: "5m", label: "5 minutes" },
  { value: "15m", label: "15 minutes" },
  { value: "30m", label: "30 minutes" },
  { value: "1h", label: "1 hour" },
  { value: "2h", label: "2 hours" },
  { value: "4h", label: "4 hours" },
];

export const CreateBotModal: React.FC<CreateBotModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<BotFormData>({
    symbol: "BTCUSDT",
    amount: 100,
    interval: "5m",
    leverage: 1,
  });

  const [errors, setErrors] = useState<Partial<BotFormData>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Partial<BotFormData> = {};

    if (formData.amount <= 0) {
      newErrors.amount = 10;
    }

    if (formData.leverage < 1 || formData.leverage > 50) {
      newErrors.leverage = 1;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      symbol: "BTCUSDT",
      amount: 100,
      interval: "5m",
      leverage: 1,
    });
    setErrors({});
    onClose();
  };

  const handleInputChange = (field: keyof BotFormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Bot</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Trading Pair</label>
            <select value={formData.symbol} onChange={(e) => handleInputChange("symbol", e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white">
              {CRYPTO_PAIRS.map((pair) => (
                <option key={pair} value={pair}>
                  {pair}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Amount (USDT)</label>
            <input type="number" min="10" step="10" value={formData.amount} onChange={(e) => handleInputChange("amount", parseFloat(e.target.value) || 0)} className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${errors.amount ? "border-red-500 dark:border-red-500" : "border-gray-300 dark:border-gray-600"}`} placeholder="Enter amount" />
            {errors.amount && <p className="text-red-500 text-sm mt-1">Minimum amount is $10</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Time Interval</label>
            <select value={formData.interval} onChange={(e) => handleInputChange("interval", e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white">
              {INTERVALS.map((interval) => (
                <option key={interval.value} value={interval.value}>
                  {interval.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Leverage: {formData.leverage}x</label>
            <div className="relative">
              <input type="range" min="1" max="50" value={formData.leverage} onChange={(e) => handleInputChange("leverage", parseInt(e.target.value))} className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer slider" />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span>1x</span>
                <span>25x</span>
                <span>50x</span>
              </div>
            </div>
            {errors.leverage && <p className="text-red-500 text-sm mt-1">Leverage must be between 1x and 50x</p>}
          </div>
        </form>

        <DialogFooter className="flex gap-2">
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleSubmit}>
            Create Bot
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
