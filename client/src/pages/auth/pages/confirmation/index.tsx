import type { FC } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Clock, CheckCircle, AlertCircle } from "lucide-react";
import { Routes } from "@/routes/routes";
import { useGetMe } from "@/features/user/hooks/use-user";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/auth.store";
import { UserMeta } from "@/features/user/interfaces/user.interface";
import ConfirmationSkeleton from "./components/confirmation-skeleton";

const Confirmation: FC = () => {
  const navigate = useNavigate();
  const { updateUser } = useAuthStore();
  const { data: user, isLoading } = useGetMe();

  useEffect(() => {
    if (isLoading) return;

    if (!user?.verified) {
      navigate(Routes.auth.credentials);
    }
    if (user?.verified && user?.enabled) {
      updateUser({
        enabled: true,
      });
      navigate(Routes.dashboard.root);
    }
  }, [user, isLoading]);

  const isAccountDisabled = !user?.enabled && user?.meta?.disabled === UserMeta.disabled_by_admin;

  if (isLoading) {
    return <ConfirmationSkeleton />;
  }

  if (isAccountDisabled) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-xl sm:text-2xl font-semibold text-red-900 dark:text-red-100">Account Disabled</CardTitle>
            <CardDescription className="text-sm sm:text-base text-red-700 dark:text-red-300">Your account is currently disabled and all your bots and trades have been stopped.</CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="p-3 sm:p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
              <div className="space-y-1 min-w-0">
                <p className="text-sm font-medium text-red-900 dark:text-red-100">Contact Support</p>
                <p className="text-xs text-red-700 dark:text-red-300">Please contact our support team to understand why your account was disabled and how to resolve this issue.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
          <Clock className="w-8 h-8 text-amber-600 dark:text-amber-400" />
        </div>
        <div className="space-y-2">
          <CardTitle className="text-xl sm:text-2xl font-semibold">Waiting for Confirmation</CardTitle>
          <CardDescription className="text-sm sm:text-base">Your account has been created and connected with Binance API successfully and is pending admin approval.</CardDescription>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-start space-x-3 p-3 sm:p-4 bg-muted/50 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
            <div className="space-y-1 min-w-0">
              <p className="text-sm font-medium">What happens next?</p>
              <p className="text-xs text-muted-foreground">An admin will review your account within 12-24 hours</p>
            </div>
          </div>

          <div className="p-3 sm:p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-start space-x-3">
              <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="space-y-1 min-w-0">
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100">Please check back later</p>
                <p className="text-xs text-blue-700 dark:text-blue-300">You will be redirected to the dashboard automatically after your account is approved.</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Confirmation;
