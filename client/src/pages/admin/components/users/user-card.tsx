import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { User, CalendarDays, DollarSign, Wallet, Copy, Check, UserX, UserCheck, Zap, Trash2 } from "lucide-react";
import type { UserAdmin } from "@/features/user/interfaces/user.interface";
import { useFormatters } from "@/hooks/useFormatters";
import { useState } from "react";
import { useUpdateUser, useDeleteUser } from "@/features/user/hooks/use-user";
import { Spinner } from "@/components/ui/spinner";
import { UserMeta } from "@/features/user/interfaces/user.interface";

interface UserCardProps {
  user: UserAdmin;
}

export const UserCard = ({ user }: UserCardProps) => {
  const { formatCurrency, formatPrice, formatDateTime } = useFormatters();
  const [isCopied, setIsCopied] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { mutate: updateUserMutation, isPending } = useUpdateUser();
  const { mutate: deleteUserMutation, isPending: isDeletePending } = useDeleteUser();

  const getInitials = (username: string) => {
    return username.charAt(0).toUpperCase();
  };

  const getSubscriptionAmounts = () => {
    const activeAmount = user?.subscriptions?.filter((sub) => sub.active)?.reduce((sum, sub) => sum + (sub.amount || 0), 0) ?? 0;

    const totalAmount = user?.subscriptions?.reduce((sum, sub) => sum + (sub.amount || 0), 0) ?? 0;

    return { activeAmount, totalAmount };
  };

  const handleCopyUuid = async () => {
    try {
      await navigator.clipboard.writeText(user.uuid);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {}
  };

  const handleToggleEnabled = () => {
    updateUserMutation({
      uuid: user.uuid,
      enabled: !user.enabled,
      meta: {
        disabled: UserMeta.disabled_by_admin,
      },
    });
  };

  const openConfirmDialog = () => {
    setIsDialogOpen(true);
  };

  const openDeleteDialog = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    deleteUserMutation(user.uuid);
    setIsDeleteDialogOpen(false);
  };

  return (
    <Card className="w-full hover:shadow-lg transition-shadow duration-200 bg-card border-border overflow-hidden">
      <CardHeader className="pb-4">
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3 sm:gap-4 w-full">
          <div className="flex items-start gap-3 min-w-0">
            <Avatar className="h-10 w-10 sm:h-12 sm:w-12 bg-primary/10 flex-shrink-0 mt-1">
              <AvatarFallback className="bg-primary/20 text-primary font-semibold text-sm sm:text-base">{getInitials(user.username)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-start gap-2 mb-2 w-full">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <h3 className="text-base sm:text-lg font-semibold text-foreground truncate">{user.username}</h3>
                </div>
                <Button variant="outline" size="sm" className="text-xs h-7 w-7 p-0 flex-shrink-0 ml-2" onClick={openDeleteDialog}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Badge variant={user.enabled ? "default" : "destructive"} className="text-xs">
                  {user.enabled ? "Enabled" : "Disabled"}
                </Badge>
                <Badge variant={user.verified ? "default" : "outline"} className="text-xs">
                  {user.verified ? "Verified" : "Unverified"}
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex justify-end w-full sm:w-auto">
            <Button variant={user.enabled ? "destructive" : "default"} size="sm" disabled={isPending} className="text-xs w-full sm:w-auto" onClick={openConfirmDialog}>
              {isPending ? (
                <Spinner className="h-4 w-4" />
              ) : user.enabled ? (
                <>
                  <UserX className="h-3 w-3 mr-1" />
                  <span className="hidden xs:inline">Disable</span>
                  <span className="xs:hidden">Disable</span>
                </>
              ) : (
                <>
                  <UserCheck className="h-3 w-3 mr-1" />
                  <span className="hidden xs:inline">Enable</span>
                  <span className="xs:hidden">Enable</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 sm:space-y-4">
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="flex items-center space-x-2">
            <Wallet className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-xs text-muted-foreground">Balance</p>
              <p className="font-semibold text-foreground text-sm sm:text-base truncate">{formatCurrency(user?.balance ?? 0)}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <DollarSign className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-xs text-muted-foreground">Commission</p>
              <p className="font-semibold text-foreground text-sm sm:text-base">{user?.commission ?? 0}%</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <DollarSign className="h-4 w-4 text-purple-600 dark:text-purple-400 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-xs text-muted-foreground">Commission Paid</p>
              <p className="font-semibold text-foreground text-sm sm:text-base">{formatCurrency(user?.commission_paid ?? 0)}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="flex items-center space-x-2">
            <DollarSign className="h-4 w-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-xs text-muted-foreground">Profit</p>
              <p className="font-semibold text-foreground text-sm sm:text-base">{formatCurrency(user?.profit ?? 0)}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Zap className="h-4 w-4 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-xs text-muted-foreground">Subscriptions</p>
              <p className="font-semibold text-foreground text-sm sm:text-base">
                {user?.subscriptions?.filter((sub) => sub.active)?.length ?? 0}/{user?.subscriptions?.length ?? 0}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Zap className="h-4 w-4 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-xs text-muted-foreground">Subscription Amounts</p>
            <p className="font-semibold text-foreground text-sm sm:text-base">
              {(() => {
                const { activeAmount, totalAmount } = getSubscriptionAmounts();
                return `${formatPrice(activeAmount)}/${formatPrice(totalAmount)}`;
              })()}
            </p>
          </div>
        </div>

        <div className="pt-2 border-t border-border">
          <div className="flex items-center space-x-2">
            <CalendarDays className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Joined</p>
              <p className="text-sm font-medium text-foreground">{formatDateTime(user.createdAt)}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 pt-2 border-t border-border">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground mb-1">User ID</p>
            <p className="text-xs font-mono text-foreground break-all">{user.uuid}</p>
          </div>
          <div className="flex justify-end">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 flex-shrink-0" onClick={handleCopyUuid}>
              {isCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardContent>

      <ConfirmationDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} onConfirm={handleToggleEnabled} title={user.enabled ? "Disable User" : "Enable User"} description={`Are you sure you want to ${user.enabled ? "disable" : "enable"} user "${user.username}"?${user.enabled ? " This will prevent them from accessing their account." : ""}`} confirmText={user.enabled ? "Disable" : "Enable"} variant={user.enabled ? "destructive" : "default"} isLoading={isPending} />

      <ConfirmationDialog isOpen={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)} onConfirm={handleDelete} title="Delete User" description={`Are you sure you want to delete user "${user.username}"? This action cannot be undone and will permanently remove all user data, subscriptions, and trading history.`} confirmText="Delete" variant="destructive" isLoading={isDeletePending} />
    </Card>
  );
};
