import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface BotInfoProps {
  quantity: number;
  price: number;
  interval: string;
  profit: number;
  formatCurrency: (amount: number) => string;
}

export const BotInfo = ({ quantity, price, interval, profit, formatCurrency }: BotInfoProps) => {
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
          <CardDescription>Price</CardDescription>
          <CardTitle className="text-xl sm:text-2xl">{formatCurrency(price)}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Entry price</p>
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
    </div>
  );
};
