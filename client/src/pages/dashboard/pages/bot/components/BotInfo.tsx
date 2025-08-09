import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Bot } from "@/features/bot/interfaces/bot.interface";
import { useFormatters } from "@/pages/dashboard/hooks";

interface BotInfoProps {
  bot: Bot;
}

export const BotInfo = ({ bot }: BotInfoProps) => {
  const { quantity, amount, interval, profit, leverage } = bot;

  const { formatCurrency } = useFormatters();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Total Profit</CardDescription>
          <CardTitle className={`text-xl sm:text-2xl ${profit >= 0 ? "text-green-600" : "text-red-600"}`}>{formatCurrency(profit)}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">All time</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Quantity</CardDescription>
          <CardTitle className="text-xl sm:text-2xl">{quantity}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Units trading</p>
        </CardContent>
      </Card>

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
          <CardDescription>Interval</CardDescription>
          <CardTitle className="text-xl sm:text-2xl">{interval}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Trading frequency</p>
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
    </div>
  );
};
