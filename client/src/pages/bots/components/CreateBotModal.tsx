import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import type { BotFormData } from "@/features/bot/interfaces/bot.interface";
import { useCreateBot } from "@/features/bot/hooks/use-bot";
import { Spinner } from "@/components/ui/spinner";
import { TimeframeSelect } from "@/components/ui/timeframe-select";

interface CreateBotModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CRYPTO_PAIRS = ["BTCUSDT", "ETHUSDT", "BNBUSDT", "XRPUSDT", "ADAUSDT", "SOLUSDT", "DOGEUSDT", "DOTUSDT", "AVAXUSDT", "MATICUSDT", "LTCUSDT", "ATOMUSDT", "LINKUSDT", "UNIUSDT", "ALGOUSDT", "VETUSDT", "FILUSDT", "TRXUSDT", "ETCUSDT", "XLMUSDT"];

export const CreateBotModal: React.FC<CreateBotModalProps> = ({ isOpen, onClose }) => {
  const { mutate: createBot, isPending: isCreatingBot } = useCreateBot();

  const [formData, setFormData] = useState<BotFormData>({
    symbol: "BTCUSDT",
    timeframe: "3m",
    active: false,
    visible: true,
  });

  const [errors, setErrors] = useState<Partial<BotFormData>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Partial<BotFormData> = {};

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    createBot(formData, {
      onSuccess: () => {
        handleClose();
      },
    });
  };

  const handleClose = () => {
    setFormData({
      symbol: "BTCUSDT",
      timeframe: "3m",
      active: false,
      visible: true,
    });
    setErrors({});
    onClose();
  };

  const handleInputChange = (field: keyof BotFormData, value: string | number | boolean) => {
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
          <div className="space-y-2">
            <Label htmlFor="symbol">Trading Pair</Label>
            <Select value={formData.symbol} onValueChange={(value) => handleInputChange("symbol", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select trading pair" />
              </SelectTrigger>
              <SelectContent>
                {CRYPTO_PAIRS.map((pair) => (
                  <SelectItem key={pair} value={pair}>
                    {pair}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="timeframe">Timeframe</Label>
            <TimeframeSelect<string> value={formData.timeframe} onValueChange={(value) => handleInputChange("timeframe", value)} type="bot" className="w-full" />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="active">Active</Label>
            <Switch id="active" checked={formData.active} onCheckedChange={(checked) => handleInputChange("active", checked)} />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="visible">Visible</Label>
            <Switch id="visible" checked={formData.visible} onCheckedChange={(checked) => handleInputChange("visible", checked)} />
          </div>
        </form>

        <DialogFooter className="flex gap-2">
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleSubmit} disabled={isCreatingBot}>
            {isCreatingBot ? <Spinner size="sm" /> : "Create Bot"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
