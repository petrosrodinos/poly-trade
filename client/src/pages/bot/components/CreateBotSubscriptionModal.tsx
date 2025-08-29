import React, { useState, useMemo } from "react";
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
import { useAuthStore } from "@/stores/auth.store";
import { RoleTypes } from "@/features/user/interfaces/user.interface";
import { useAccountStatus } from "@/features/account/hooks/use-account";

interface CreateBotSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateBotSubscriptionModal: React.FC<CreateBotSubscriptionModalProps> = ({ isOpen, onClose }) => {
  const { uuid } = useParams();
  const { mutate: createBot, isPending: isCreatingBot } = useCreateBotSubscription(uuid as string);
  const { role } = useAuthStore();
  const isAdmin = role === RoleTypes.admin;
  const { data: accountStatus } = useAccountStatus();
  const availableBalance = accountStatus?.availableBalance;

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

  const handleLeverageChange = (value: number[]) => {
    handleInputChange("leverage", value[0]);
  };

  const maxAvailableAmount = useMemo(() => {
    if (!availableBalance) return 0;
    return Math.floor(availableBalance * formData.leverage);
  }, [availableBalance, formData.leverage]);

  const hasAvailableBalance = availableBalance && availableBalance > 0;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Bot</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!hasAvailableBalance && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <svg className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <div className="text-sm text-red-600 dark:text-red-400">
                  <p className="font-medium">No Available Balance</p>
                  <p className="text-xs mt-1 text-red-600/80 dark:text-red-400/80">Please ensure you have sufficient balance in your futures account to create a bot subscription.</p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="amount">Amount (USDT)</Label>
            <div className="px-3 mt-2">
              <Slider value={[formData.amount]} onValueChange={(value) => handleInputChange("amount", value[0])} max={maxAvailableAmount} min={10} step={10} className={`w-full ${!hasAvailableBalance ? "opacity-50 cursor-not-allowed" : ""}`} disabled={!hasAvailableBalance} />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>$10</span>
                <span>${Math.floor(maxAvailableAmount / 2)}</span>
                <span>${maxAvailableAmount}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Input id="amount" type="number" min="10" max={maxAvailableAmount} step="10" value={formData.amount} onChange={(e) => handleInputChange("amount", parseFloat(e.target.value) || 0)} placeholder="Enter amount" className={`flex-1 ${errors.amount ? "border-destructive" : ""}`} disabled={!hasAvailableBalance} />
              <span className="text-sm text-muted-foreground whitespace-nowrap">Max: ${maxAvailableAmount}</span>
            </div>
            {errors.amount && <p className="text-sm text-destructive">Amount must be between $10 and ${maxAvailableAmount}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="leverage">Leverage: {formData.leverage}x</Label>
            <div className="px-3 mt-2">
              <Slider value={[formData.leverage]} onValueChange={handleLeverageChange} max={50} min={1} step={1} className={`w-full ${!isAdmin || !hasAvailableBalance ? "opacity-50 cursor-not-allowed" : ""}`} disabled={!isAdmin || !hasAvailableBalance} />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>1x</span>
                <span>25x</span>
                <span>50x</span>
              </div>
            </div>
            {errors.leverage && <p className="text-sm text-destructive">Leverage must be between 1x and 50x</p>}
            {formData.leverage > 1 && (
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 mt-2">
                <div className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <div className="text-sm text-yellow-600 dark:text-yellow-400">
                    <p className="font-medium">High Leverage Warning</p>
                    <p className="text-xs mt-1 text-yellow-600/80 dark:text-yellow-400/80">
                      Higher leverage multiplies both potential profits and losses. An {formData.leverage}x leverage means a {Math.round((1 / formData.leverage) * 100)}% price movement against your position could result in significant losses.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="active">Start Bot Immediately</Label>
            <Switch id="active" checked={formData.active} onCheckedChange={(checked) => handleInputChange("active", checked)} disabled={!hasAvailableBalance} />
          </div>
        </form>

        <DialogFooter className="flex gap-2">
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleSubmit} disabled={isCreatingBot || !hasAvailableBalance}>
            {isCreatingBot ? <Spinner size="sm" /> : "Create Bot"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
