import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import type { BotSubscriptionFormData } from "@/features/bot-subscription/interfaces/bot-subscription.interface";
import { useCreateBotSubscription } from "@/features/bot-subscription/hooks/use-bot-subscription";
import { Spinner } from "@/components/ui/spinner";
import { useParams } from "react-router-dom";

interface CreateBotSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateBotSubscriptionModal: React.FC<CreateBotSubscriptionModalProps> = ({ isOpen, onClose }) => {
  const { uuid } = useParams();
  const { mutate: createBot, isPending: isCreatingBot } = useCreateBotSubscription(uuid as string);

  const [formData, setFormData] = useState<BotSubscriptionFormData>({
    bot_uuid: uuid as string,
    amount: 100,
    leverage: 1,
    active: true,
  });

  const [errors, setErrors] = useState<Partial<BotSubscriptionFormData>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Partial<BotSubscriptionFormData> = {};

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

    createBot(formData, {
      onSuccess: () => {
        handleClose();
      },
    });
  };

  const handleClose = () => {
    setFormData({
      bot_uuid: uuid as string,
      amount: 100,
      leverage: 1,
      active: true,
    });
    setErrors({});
    onClose();
  };

  const handleInputChange = (field: keyof BotSubscriptionFormData, value: string | number | boolean) => {
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
            <Label htmlFor="amount">Amount (USDT)</Label>
            <Input id="amount" type="number" min="10" step="10" value={formData.amount} onChange={(e) => handleInputChange("amount", parseFloat(e.target.value) || 0)} placeholder="Enter amount" className={errors.amount ? "border-destructive" : ""} />
            {errors.amount && <p className="text-sm text-destructive">Minimum amount is $10</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="leverage">Leverage: {formData.leverage}x</Label>
            <div className="px-3 mt-2">
              <Slider value={[formData.leverage]} onValueChange={(value) => handleInputChange("leverage", value[0])} max={50} min={1} step={1} className="w-full" />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>1x</span>
                <span>25x</span>
                <span>50x</span>
              </div>
            </div>
            {errors.leverage && <p className="text-sm text-destructive">Leverage must be between 1x and 50x</p>}
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="active">Start Bot Immediately</Label>
            <Switch id="active" checked={formData.active} onCheckedChange={(checked) => handleInputChange("active", checked)} />
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
