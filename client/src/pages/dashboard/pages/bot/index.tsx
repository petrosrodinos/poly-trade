import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFormatters } from "../../hooks";
import { useAccountTrades, useAccountIncome } from "@/features/account/hooks/use-account";
import { TradesTable } from "./components/TradesTable";
import { IncomeTable } from "./components/IncomeTable";

const BotPage = () => {
  const { data: trades, isLoading: isTradesLoading } = useAccountTrades();
  const { data: income, isLoading: isIncomeLoading } = useAccountIncome();

  const { formatCurrency, formatTimestamp } = useFormatters();
  return (
    <div>
      <Tabs defaultValue="trades" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="trades">Recent Trades</TabsTrigger>
          <TabsTrigger value="income">Income History</TabsTrigger>
        </TabsList>

        <TabsContent value="trades" className="space-y-4">
          <TradesTable trades={trades} isLoading={isTradesLoading} formatCurrency={formatCurrency} formatTimestamp={formatTimestamp} />
        </TabsContent>

        <TabsContent value="income" className="space-y-4">
          <IncomeTable income={income} isLoading={isIncomeLoading} formatCurrency={formatCurrency} formatTimestamp={formatTimestamp} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BotPage;
