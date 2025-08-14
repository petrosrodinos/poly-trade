import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { useDeleteBot, useUpdateBot } from "@/features/bot/hooks/use-bot";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import type { Bot } from "@/features/bot/interfaces/bot.interface";
import { Shield } from "lucide-react";

interface AdminBotControlsProps {
  bot: Bot;
  isLoading: boolean;
}

export const AdminBotControls = ({ bot, isLoading }: AdminBotControlsProps) => {
  const navigate = useNavigate();
  const { active, symbol, uuid } = bot;

  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    type: "enable" | "disable" | "delete";
    title: string;
    description: string;
    confirmText: string;
    variant: "default" | "destructive";
  }>({
    isOpen: false,
    type: "enable",
    title: "",
    description: "",
    confirmText: "",
    variant: "default",
  });

  const deleteBotMutation = useDeleteBot();
  const updateBotMutation = useUpdateBot(uuid);

  const handleEnableDisableClick = () => {
    if (active) {
      setConfirmDialog({
        isOpen: true,
        type: "disable",
        title: "Disable Trading Bot",
        description: `Are you sure you want to disable the ${symbol} trading bot? This will halt all trading activities for this bot.`,
        confirmText: "Disable Bot",
        variant: "destructive",
      });
    } else {
      setConfirmDialog({
        isOpen: true,
        type: "enable",
        title: "Enable Trading Bot",
        description: `Are you sure you want to enable the ${symbol} trading bot? This will allow the bot to begin automated trading activities.`,
        confirmText: "Enable Bot",
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
      case "enable":
        updateBotMutation.mutate({
          uuid,
          active: true,
        });
        break;
      case "disable":
        updateBotMutation.mutate({
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
      <Card className="p-4 bg-gradient-to-r from-orange-50/50 to-amber-50/50 dark:from-orange-950/20 dark:to-amber-950/20 border-orange-200 dark:border-orange-800 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6">
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            <div className="h-6 w-32 bg-muted rounded animate-pulse"></div>
          </div>
          <div className="flex items-center justify-center gap-3">
            <Spinner size="sm" />
            <span className="text-sm text-muted-foreground">Loading admin controls...</span>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 bg-gradient-to-r from-orange-50/50 to-amber-50/50 dark:from-orange-950/20 dark:to-amber-950/20 border-orange-200 dark:border-orange-800 shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            <Badge variant="outline" className="text-sm px-3 py-1 font-medium border-orange-300 text-orange-700 dark:border-orange-700 dark:text-orange-300">
              Admin Controls
            </Badge>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 min-w-0">
          <Button variant={active ? "destructive" : "default"} size="sm" onClick={handleEnableDisableClick} disabled={updateBotMutation.isPending} className={`w-full sm:w-auto sm:min-w-[120px] font-medium transition-all duration-200 ${active ? "bg-red-500 hover:bg-red-600 shadow-red-500/20 shadow-lg" : "bg-green-500 hover:bg-green-600 text-white shadow-green-500/20 shadow-lg"}`}>
            <div className="flex items-center justify-center gap-2 min-w-0">
              {updateBotMutation.isPending ? (
                <>
                  <Spinner size="sm" />
                  <span className="hidden sm:inline truncate">{active ? "Disabling..." : "Enabling..."}</span>
                  <span className="sm:hidden truncate">{active ? "Disable..." : "Enable..."}</span>
                </>
              ) : active ? (
                <>
                  <div className="w-2 h-2 bg-white rounded-sm flex-shrink-0"></div>
                  <span className="hidden sm:inline truncate">Disable Bot</span>
                  <span className="sm:hidden truncate">Disable</span>
                </>
              ) : (
                <>
                  <div className="w-0 h-0 border-l-[6px] border-l-white border-y-[4px] border-y-transparent flex-shrink-0"></div>
                  <span className="hidden sm:inline truncate">Enable Bot</span>
                  <span className="sm:hidden truncate">Enable</span>
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

      <ConfirmationDialog isOpen={confirmDialog.isOpen} onClose={closeDialog} onConfirm={handleConfirmAction} title={confirmDialog.title} description={confirmDialog.description} confirmText={confirmDialog.confirmText} variant={confirmDialog.variant} isLoading={updateBotMutation.isPending || deleteBotMutation.isPending} />
    </Card>
  );
};
