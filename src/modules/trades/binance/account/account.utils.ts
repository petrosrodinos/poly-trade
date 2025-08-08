import { FuturesIncome, FuturesTrade } from "@/integrations/binance/binance.interfaces";
import { TradeProfitSummary } from "./account.interfaces";

export class AccountUtils {

    constructor() { }

    calculateTotalProfit(trades: FuturesTrade[]): TradeProfitSummary {
        let grossProfit = 0;
        let commission = 0;

        for (const trade of trades) {
            grossProfit += parseFloat(trade.realizedPnl);
            commission += parseFloat(trade.commission);
        }

        return {
            grossProfit,
            commission,
            netProfit: grossProfit - commission
        };
    }

    calculateIncomeSummary(incomes: FuturesIncome[]): TradeProfitSummary {
        let grossProfit = 0;
        let commission = 0;

        for (const income of incomes) {
            if (income.incomeType === "REALIZED_PNL") {
                grossProfit += parseFloat(income.income);
            } else if (income.incomeType === "COMMISSION") {
                commission += Math.abs(parseFloat(income.income));
            }
        }

        return {
            grossProfit,
            commission,
            netProfit: grossProfit - commission
        };
    }
}