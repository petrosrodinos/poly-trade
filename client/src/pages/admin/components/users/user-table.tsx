import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { CalendarDays, DollarSign, Wallet, Copy, Check, UserX, UserCheck, Zap } from "lucide-react";
import type { User as UserInterface } from "@/features/user/interfaces/user.interface";
import { useFormatters } from "@/hooks/useFormatters";
import { useState } from "react";
import { useUpdateUser } from "@/features/user/hooks/use-user";
import { Spinner } from "@/components/ui/spinner";

interface UserTableProps {
  users: UserInterface[];
}

export const UserTable = ({ users }: UserTableProps) => {
  const { formatCurrency, formatPrice, formatDateTime } = useFormatters();
  const [isCopied, setIsCopied] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<string | null>(null);
  const { mutate: updateUserMutation, isPending } = useUpdateUser();

  const getInitials = (username: string) => {
    return username.charAt(0).toUpperCase();
  };

  const getSubscriptionAmounts = (user: UserInterface) => {
    const activeAmount = user?.subscriptions?.filter((sub) => sub.active)?.reduce((sum, sub) => sum + (sub.amount || 0), 0) ?? 0;
    const totalAmount = user?.subscriptions?.reduce((sum, sub) => sum + (sub.amount || 0), 0) ?? 0;
    return { activeAmount, totalAmount };
  };

  const handleCopyUuid = async (uuid: string) => {
    try {
      await navigator.clipboard.writeText(uuid);
      setIsCopied(uuid);
      setTimeout(() => setIsCopied(null), 2000);
    } catch {}
  };

  const handleToggleEnabled = (user: UserInterface) => {
    updateUserMutation({
      uuid: user.uuid,
      enabled: !user.enabled,
    });
  };

  const openConfirmDialog = (uuid: string) => {
    setIsDialogOpen(uuid);
  };

  return (
    <div className="w-full overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Balance</TableHead>
            <TableHead>Commission</TableHead>
            <TableHead>Commission Paid</TableHead>
            <TableHead>Subscriptions</TableHead>
            <TableHead>Subscription Amounts</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => {
            const { activeAmount, totalAmount } = getSubscriptionAmounts(user);
            return (
              <TableRow key={user.uuid}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8 bg-primary/10">
                      <AvatarFallback className="bg-primary/20 text-primary font-semibold text-sm">{getInitials(user.username)}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="font-medium text-foreground truncate">{user.username}</p>
                      <p className="text-xs text-muted-foreground font-mono truncate">{user.uuid}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <Badge variant={user.enabled ? "default" : "destructive"} className="text-xs w-fit">
                      {user.enabled ? "Enabled" : "Disabled"}
                    </Badge>
                    <Badge variant={user.verified ? "default" : "outline"} className="text-xs w-fit">
                      {user.verified ? "Verified" : "Unverified"}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Wallet className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <span className="font-medium">{formatCurrency(user?.balance ?? 0)}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <span className="font-medium">{user?.commission ?? 0}%</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    <span className="font-medium">{formatCurrency(user?.commission_paid ?? 0)}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                    <span className="font-medium">
                      {user?.subscriptions?.filter((sub) => sub.active)?.length ?? 0}/{user?.subscriptions?.length ?? 0}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                    <span className="font-medium">
                      {formatPrice(activeAmount)}/{formatPrice(totalAmount)}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{formatDateTime(user.createdAt)}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleCopyUuid(user.uuid)}>
                      {isCopied === user.uuid ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    </Button>
                    <Button variant={user.enabled ? "destructive" : "default"} size="sm" disabled={isPending} className="text-xs" onClick={() => openConfirmDialog(user.uuid)}>
                      {isPending ? (
                        <Spinner className="h-4 w-4" />
                      ) : user.enabled ? (
                        <>
                          <UserX className="h-3 w-3 mr-1" />
                          Disable
                        </>
                      ) : (
                        <>
                          <UserCheck className="h-3 w-3 mr-1" />
                          Enable
                        </>
                      )}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {users.map((user) => (
        <ConfirmationDialog key={user.uuid} isOpen={isDialogOpen === user.uuid} onClose={() => setIsDialogOpen(null)} onConfirm={() => handleToggleEnabled(user)} title={user.enabled ? "Disable User" : "Enable User"} description={`Are you sure you want to ${user.enabled ? "disable" : "enable"} user "${user.username}"?${user.enabled ? " This will prevent them from accessing their account." : ""}`} confirmText={user.enabled ? "Disable" : "Enable"} variant={user.enabled ? "destructive" : "default"} isLoading={isPending} />
      ))}
    </div>
  );
};
