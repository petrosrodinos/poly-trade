import { useNavigate } from "react-router-dom";
import { Bot, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const BotNotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-[400px] p-4">
      <Card className="w-full max-w-md mx-auto text-center">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <Bot className="h-16 w-16 text-muted-foreground" />
              <AlertCircle className="h-6 w-6 text-destructive absolute -top-1 -right-1" />
            </div>
          </div>
          <CardTitle className="text-xl sm:text-2xl">Bot Not Found</CardTitle>
          <CardDescription className="text-base">The bot you're looking for doesn't exist or may have been deleted.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={() => navigate("/dashboard")} className="w-full sm:w-auto">
              Back to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
