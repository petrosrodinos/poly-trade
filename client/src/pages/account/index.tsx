import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Lock, Calendar, User as UserIcon } from "lucide-react";
import ChangePasswordForm from "./components/change-password-form";
import EditUsernameForm from "./components/edit-username-form";
import { useGetMe } from "@/features/user/hooks/use-user";

interface AccountPageProps {}

type ViewType = "main" | "changePassword" | "editUsername";

const AccountPage = ({}: AccountPageProps) => {
  const { data: user, isLoading } = useGetMe();
  const [currentView, setCurrentView] = useState<ViewType>("main");

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleBackToMain = () => {
    setCurrentView("main");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Failed to load user data</p>
      </div>
    );
  }

  if (currentView === "changePassword") {
    return (
      <div className="container mx-auto px-4 py-6 pb-20">
        <div className="max-w-2xl mx-auto">
          <ChangePasswordForm onBack={handleBackToMain} />
        </div>
      </div>
    );
  }

  if (currentView === "editUsername") {
    return (
      <div className="container mx-auto px-4 py-6 pb-20">
        <div className="max-w-2xl mx-auto">
          <EditUsernameForm onBack={handleBackToMain} user={user} />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 pb-20">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-4">
          <Avatar className="h-24 w-24 mx-auto">
            <AvatarFallback className="text-2xl bg-primary text-primary-foreground">{getInitials(user.username)}</AvatarFallback>
          </Avatar>

          <div className="flex items-center justify-center gap-2">
            <h1 className="text-2xl font-bold">{user.username}</h1>
            <Button variant="ghost" size="sm" onClick={() => setCurrentView("editUsername")} className="h-8 w-8 p-0">
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserIcon className="h-5 w-5" />
              Account Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Username</span>
              <span className="font-medium">{user.username}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Member Since</span>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{formatDate(user.createdAt)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Security
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setCurrentView("changePassword")} className="w-full" variant="outline">
              <Lock className="h-4 w-4 mr-2" />
              Change Password
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AccountPage;
