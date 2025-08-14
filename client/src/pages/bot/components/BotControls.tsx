import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { useDeleteBotSubscription, useUpdateBotSubscription } from "@/features/bot-subscription/hooks/use-bot-subscription";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { RefreshCw } from "lucide-react";
import type { BotSubscription } from "@/features/bot-subscription/interfaces/bot-subscription.interface";
import type { Bot } from "@/features/bot/interfaces/bot.interface";

interface BotControlsProps {
  bot_subscription: BotSubscription;
  bot: Bot;
  isLoading: boolean;
  isRefetching: boolean;
  refetch: () => void;
}

export const BotControls = ({ bot_subscription, bot, isLoading, refetch, isRefetching }: BotControlsProps) => {
  const navigate = useNavigate();
  const { active, uuid } = bot_subscription;
  const { symbol, uuid: bot_uuid } = bot;

  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    type: "start" | "stop" | "delete";
    title: string;
    description: string;
    confirmText: string;
    variant: "default" | "destructive";
  }>({
    isOpen: false,
    type: "start",
    title: "",
    description: "",
    confirmText: "",
    variant: "default",
  });

  const updateBotSubscriptionMutation = useUpdateBotSubscription(bot_uuid);
  const deleteBotMutation = useDeleteBotSubscription(bot_uuid);

  const handleStartStopClick = () => {
    if (active) {
      setConfirmDialog({
        isOpen: true,
        type: "stop",
        title: "Stop Trading Bot",
        description: `Are you sure you want to stop the ${symbol} trading bot? This will halt all trading activities for this bot.`,
        confirmText: "Stop Bot",
        variant: "destructive",
      });
    } else {
      setConfirmDialog({
        isOpen: true,
        type: "start",
        title: "Start Trading Bot",
        description: `Are you sure you want to start the ${symbol} trading bot? This will begin automated trading activities.`,
        confirmText: "Start Bot",
        variant: "default",
      });
    }
  };

  const handleDeleteClick = () => {
    setConfirmDialog({
      isOpen: true,
      type: "delete",
      title: "Delete Trading Bot",
      description: `Are you sure you want to permanently delete the ${symbol} trading bot? This action cannot be undone and will remove all bot data and trading history.`,
      confirmText: "Delete Bot",
      variant: "destructive",
    });
  };

  const handleConfirmAction = () => {
    switch (confirmDialog.type) {
      case "start":
        updateBotSubscriptionMutation.mutate({
          uuid,
          active: true,
        });
        break;
      case "stop":
        updateBotSubscriptionMutation.mutate({
          uuid,
          active: false,
        });
        break;
      case "delete":
        deleteBotMutation.mutate(uuid, {
          onSuccess: () => {
            navigate("/dashboard");
          },
        });
        break;
    }
  };

  const closeDialog = () => {
    setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
  };

  if (isLoading) {
    return (
      <Card className="p-4 bg-gradient-to-r from-muted/20 to-muted/40 border shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-muted animate-pulse"></div>
              <div className="h-6 w-20 bg-muted rounded animate-pulse"></div>
            </div>
            <Separator orientation="vertical" className="h-6 hidden sm:block" />
            <div className="h-4 w-24 bg-muted rounded animate-pulse"></div>
          </div>
          <div className="flex items-center justify-center gap-3">
            <Spinner size="sm" />
            <span className="text-sm text-muted-foreground">Loading bot controls...</span>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 bg-gradient-to-r from-muted/20 to-muted/40 border shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full flex items-center justify-center ${active ? "bg-green-500 shadow-green-500/50 shadow-lg animate-pulse" : "bg-muted-foreground"}`}>{active && <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>}</div>
            <Badge variant={active ? "default" : "secondary"} className={`text-sm px-3 py-1 font-medium ${active ? "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800" : ""}`}>
              {active ? "Active" : "Inactive"}
            </Badge>
          </div>

          <Separator orientation="vertical" className="h-6 hidden sm:block" />

          <div className="text-sm text-muted-foreground">
            Symbol: <span className={`font-medium ${active ? "text-green-700" : "text-muted-foreground"}`}>{symbol}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 min-w-0">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={refetch} disabled={isRefetching} className="flex items-center gap-2">
              <RefreshCw className={`h-4 w-4 ${isRefetching ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>

          <Button variant={active ? "destructive" : "default"} size="sm" onClick={handleStartStopClick} disabled={updateBotSubscriptionMutation.isPending} className={`w-full sm:w-auto sm:min-w-[100px] font-medium transition-all duration-200 ${active ? "bg-red-500 hover:bg-red-600 shadow-red-500/20 shadow-lg" : "bg-green-500 hover:bg-green-600 text-white shadow-green-500/20 shadow-lg"}`}>
            <div className="flex items-center justify-center gap-2 min-w-0">
              {updateBotSubscriptionMutation.isPending ? (
                <>
                  <Spinner size="sm" />
                  <span className="hidden sm:inline truncate">{active ? "Stopping..." : "Starting..."}</span>
                  <span className="sm:hidden truncate">{active ? "Stop..." : "Start..."}</span>
                </>
              ) : active ? (
                <>
                  <div className="w-2 h-2 bg-white rounded-sm flex-shrink-0"></div>
                  <span className="hidden sm:inline truncate">Stop Bot</span>
                  <span className="sm:hidden truncate">Stop</span>
                </>
              ) : (
                <>
                  <div className="w-0 h-0 border-l-[6px] border-l-white border-y-[4px] border-y-transparent flex-shrink-0"></div>
                  <span className="hidden sm:inline truncate">Start Bot</span>
                  <span className="sm:hidden truncate">Start</span>
                </>
              )}
            </div>
          </Button>

          <Button variant="outline" size="sm" onClick={handleDeleteClick} disabled={deleteBotMutation.isPending} className="w-full sm:w-auto sm:min-w-[100px] border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-all duration-200 disabled:opacity-50">
            <div className="flex items-center justify-center gap-2 min-w-0">
              {deleteBotMutation.isPending ? (
                <>
                  <Spinner size="sm" />
                  <span className="hidden sm:inline truncate">Deleting...</span>
                  <span className="sm:hidden truncate">Delete...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span className="hidden sm:inline truncate">Delete Bot</span>
                  <span className="sm:hidden truncate">Delete</span>
                </>
              )}
            </div>
          </Button>
        </div>
      </div>

      <ConfirmationDialog isOpen={confirmDialog.isOpen} onClose={closeDialog} onConfirm={handleConfirmAction} title={confirmDialog.title} description={confirmDialog.description} confirmText={confirmDialog.confirmText} variant={confirmDialog.variant} isLoading={updateBotSubscriptionMutation.isPending || deleteBotMutation.isPending} />
    </Card>
  );
};
