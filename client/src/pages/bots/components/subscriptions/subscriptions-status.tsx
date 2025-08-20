import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { Play, Square, Bot as BotIcon } from "lucide-react";
import { useState } from "react";
import type { BotSubscription } from "@/features/bot-subscription/interfaces/bot-subscription.interface";
import { useStartAllBotSubscriptions, useStopAllBotSubscriptions } from "@/features/bot-subscription/hooks/use-bot-subscription";
import { useAuthStore } from "@/stores/auth.store";
import { RoleTypes } from "@/features/user/interfaces/user.interface";

interface SubscriptionsStatusProps {
  subscriptions: BotSubscription[];
  className?: string;
}

export const SubscriptionsStatus = ({ subscriptions, className }: SubscriptionsStatusProps) => {
  const { mutate: startAllSubscriptions, isPending: isStartingAll } = useStartAllBotSubscriptions();
  const { mutate: stopAllSubscriptions, isPending: isStoppingAll } = useStopAllBotSubscriptions();

  const { role } = useAuthStore();
  const isAdmin = role === RoleTypes.admin;

  const [showStartDialog, setShowStartDialog] = useState(false);
  const [showStopDialog, setShowStopDialog] = useState(false);

  const activeSubscriptions = subscriptions.filter((sub) => sub.active).length;
  const totalSubscriptions = subscriptions.length;
  const totalInvestment = subscriptions.reduce((sum, sub) => sum + sub.amount, 0);

  const handleStartAllSubscriptions = () => {
    startAllSubscriptions();
    setShowStartDialog(false);
  };

  const handleStopAllSubscriptions = () => {
    stopAllSubscriptions();
    setShowStopDialog(false);
  };

  return (
    <Card className={`border-0 shadow-lg ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <BotIcon className="w-5 h-5 mr-2" />
          My Subscriptions Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{activeSubscriptions}</div>
            <div className="text-sm text-muted-foreground">Active</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{totalSubscriptions}</div>
            <div className="text-sm text-muted-foreground">Total</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">${totalInvestment.toFixed(2)}</div>
            <div className="text-sm text-muted-foreground">Invested</div>
          </div>
        </div>

        {isAdmin && (
          <div className="pt-4 space-y-2">
            <Button onClick={() => setShowStartDialog(true)} disabled={activeSubscriptions === totalSubscriptions || isStartingAll || isStoppingAll} className="w-full bg-green-600 hover:bg-green-700 text-white" size="sm">
              <Play className={`w-4 h-4 mr-2 ${isStartingAll ? "animate-spin" : ""}`} />
              Start All Subscriptions
            </Button>
            <Button onClick={() => setShowStopDialog(true)} disabled={activeSubscriptions === 0 || isStartingAll || isStoppingAll} className="w-full bg-red-600 hover:bg-red-700 text-white" size="sm">
              <Square className={`w-4 h-4 mr-2 ${isStoppingAll ? "animate-spin" : ""}`} />
              Stop All Subscriptions
            </Button>
          </div>
        )}
      </CardContent>

      <ConfirmationDialog isOpen={showStartDialog} onClose={() => setShowStartDialog(false)} onConfirm={handleStartAllSubscriptions} title="Start All Subscriptions" description={`Are you sure you want to start all ${totalSubscriptions - activeSubscriptions} inactive subscriptions? This will begin automated trading on all your subscribed bots.`} confirmText="Start All Subscriptions" cancelText="Cancel" variant="default" isLoading={isStartingAll} />

      <ConfirmationDialog isOpen={showStopDialog} onClose={() => setShowStopDialog(false)} onConfirm={handleStopAllSubscriptions} title="Stop All Subscriptions" description={`Are you sure you want to stop all ${activeSubscriptions} active subscriptions? This will halt all automated trading activities.`} confirmText="Stop All Subscriptions" cancelText="Cancel" variant="destructive" isLoading={isStoppingAll} />
    </Card>
  );
};
