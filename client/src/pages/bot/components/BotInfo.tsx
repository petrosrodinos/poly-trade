import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import type { Bot } from "@/features/bot/interfaces/bot.interface";
import { useFormatters } from "@/pages/dashboard/hooks";
import type { BotSubscription } from "@/features/bot-subscription/interfaces/bot-subscription.interface";

interface BotInfoProps {
  bot: Bot;
  bot_subscription: BotSubscription;
  isLoading: boolean;
}

export const BotInfo = ({ bot, bot_subscription, isLoading }: BotInfoProps) => {
  const { timeframe } = bot;
  const { amount, leverage, profit } = bot_subscription;

  const { formatCurrency } = useFormatters();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <CardDescription className="h-4 bg-muted rounded animate-pulse"></CardDescription>
              <div className="flex items-center justify-center h-8">
                <Spinner size="sm" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-3 bg-muted rounded animate-pulse"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Total Profit</CardDescription>
          <CardTitle className={`text-xl sm:text-2xl ${profit && profit >= 0 ? "text-green-600" : "text-destructive"}`}>{formatCurrency(profit || 0)}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">All time</p>
        </CardContent>
      </Card>

      {/* <Card>
        <CardHeader className="pb-2">
          <CardDescription>Quantity</CardDescription>
          <CardTitle className="text-xl sm:text-2xl">{quantity}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Units trading</p>
        </CardContent>
      </Card> */}

      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Amount</CardDescription>
          <CardTitle className="text-xl sm:text-2xl">{formatCurrency(amount)}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Entry amount</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Leverage</CardDescription>
          <CardTitle className="text-xl sm:text-2xl">{leverage}x</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Leverage used</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Timeframe</CardDescription>
          <CardTitle className="text-xl sm:text-2xl">{timeframe}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Trading frequency</p>
        </CardContent>
      </Card>
    </div>
  );
};
