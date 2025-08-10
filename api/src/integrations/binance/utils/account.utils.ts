import { FuturesIncome, FuturesTrade } from "@/integrations/binance/binance.interfaces";
import { AccountChartData, Timeframe, TradeProfitSummary } from "../../../modules/trades/binance/account/account.interfaces";

export class AccountUtils {

    constructor() { }

    calculateTotalProfit(trades: FuturesTrade[]): TradeProfitSummary {

        if (trades.length === 0) {
            return {
                grossProfit: 0,
                commission: 0,
                netProfit: 0,
                averageProfit: 0,
                averageCommission: 0,
                trades: 0
            };
        }

        let grossProfit = 0;
        let commission = 0;

        for (const trade of trades) {
            grossProfit += parseFloat(trade.realizedPnl);
            commission += parseFloat(trade.commission);
        }

        return {
            grossProfit,
            commission,
            netProfit: grossProfit - commission,
            averageProfit: grossProfit / trades.length,
            averageCommission: commission / trades.length,
            trades: trades.length
        };
    }

    calculateIncomeSummary(incomes: FuturesIncome[]): TradeProfitSummary {

        if (incomes.length === 0) {
            return {
                grossProfit: 0,
                commission: 0,
                netProfit: 0,
                averageProfit: 0,
                averageCommission: 0,
                trades: 0
            };
        }

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
            netProfit: grossProfit - commission,
            averageProfit: grossProfit / incomes.length,
            averageCommission: commission / incomes.length,
            trades: incomes.length

        };
    }



    sortTrades(trades: FuturesTrade[]): FuturesTrade[] {
        return trades.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
    }

    sortIncomes(incomes: FuturesIncome[]): FuturesIncome[] {
        return incomes.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
    }

    calculateIncomeChart(
        incomes: FuturesIncome[],
        timeframe: Timeframe = "hour"
    ): AccountChartData[] {
        const grouped = incomes.reduce((acc: Record<string, number>, entry) => {
            const date = new Date(entry.time);
            let key: string;

            switch (timeframe) {
                case "1minute":
                case "3minute":
                case "5minute":
                case "15minute":
                case "30minute": {
                    // Extract the number of minutes from the timeframe string
                    const minuteCount = parseInt(timeframe.replace("minute", ""), 10);
                    const minutes = date.getUTCMinutes();
                    // Round down minutes to the nearest interval bucket (e.g. for 3 minutes: 0,3,6,9,...)
                    const roundedMinutes = Math.floor(minutes / minuteCount) * minuteCount;
                    // Build key like YYYY-MM-DDTHH:mm:00Z, zero pad minutes if needed
                    const paddedMinutes = roundedMinutes.toString().padStart(2, "0");
                    key = `${date.getUTCFullYear()}-${(date.getUTCMonth() + 1)
                        .toString()
                        .padStart(2, "0")}-${date
                            .getUTCDate()
                            .toString()
                            .padStart(2, "0")}T${date
                                .getUTCHours()
                                .toString()
                                .padStart(2, "0")}:${paddedMinutes}:00Z`;
                    break;
                }
                case "hour":
                    key = date.toISOString().slice(0, 13) + ":00Z"; // YYYY-MM-DDTHH:00Z
                    break;
                case "day":
                    key = date.toISOString().slice(0, 10); // YYYY-MM-DD
                    break;
                case "week": {
                    const firstDayOfWeek = new Date(date);
                    const day = date.getUTCDay(); // 0 (Sun) - 6 (Sat)
                    const diff = date.getUTCDate() - day; // Move to Sunday
                    firstDayOfWeek.setUTCDate(diff);
                    firstDayOfWeek.setUTCHours(0, 0, 0, 0);
                    key = firstDayOfWeek.toISOString().slice(0, 10); // Week start date
                    break;
                }
                case "month":
                    key = date.toISOString().slice(0, 7); // YYYY-MM
                    break;
                default:
                    key = date.toISOString();
            }

            if (!acc[key]) {
                acc[key] = 0;
            }
            acc[key] += parseFloat(entry.income);

            return acc;
        }, {});

        return Object.entries(grouped).map(([time, value]) => ({
            time,
            value,
        }));
    }

    calculateTradesChart(trades: FuturesTrade[], timeframe: Timeframe = "hour"): AccountChartData[] {
        const grouped = trades.reduce((acc: Record<string, number>, trade) => {
            const date = new Date(trade.time);
            let key: string;

            switch (timeframe) {
                case "1minute":
                case "3minute":
                case "5minute":
                case "15minute":
                case "30minute": {
                    const minuteCount = parseInt(timeframe.replace("minute", ""), 10);
                    const minutes = date.getUTCMinutes();
                    const roundedMinutes = Math.floor(minutes / minuteCount) * minuteCount;
                    const paddedMinutes = roundedMinutes.toString().padStart(2, "0");
                    key = `${date.getUTCFullYear()}-${(date.getUTCMonth() + 1)
                        .toString()
                        .padStart(2, "0")}-${date
                            .getUTCDate()
                            .toString()
                            .padStart(2, "0")}T${date
                                .getUTCHours()
                                .toString()
                                .padStart(2, "0")}:${paddedMinutes}:00Z`;
                    break;
                }
                case "hour":
                    key = date.toISOString().slice(0, 13) + ":00Z";
                    break;
                case "day":
                    key = date.toISOString().slice(0, 10);
                    break;
                case "week": {
                    const firstDayOfWeek = new Date(date);
                    const day = date.getUTCDay();
                    const diff = date.getUTCDate() - day;
                    firstDayOfWeek.setUTCDate(diff);
                    firstDayOfWeek.setUTCHours(0, 0, 0, 0);
                    key = firstDayOfWeek.toISOString().slice(0, 10);
                    break;
                }
                case "month":
                    key = date.toISOString().slice(0, 7);
                    break;
                default:
                    key = date.toISOString();
            }

            if (!acc[key]) {
                acc[key] = 0;
            }

            // Net income = Realized PnL - Commission
            acc[key] += parseFloat(trade.realizedPnl) - parseFloat(trade.commission);

            return acc;
        }, {});

        return Object.entries(grouped).map(([time, value]) => ({
            time,
            value,
        }));
    }

    calculateQuantity(amount: number, price: number, minQty: number, stepSize: number) {

        let qty = amount / price;

        // If below minimum, set to 0 to skip
        if (qty < minQty) {
            return 0;
        }

        // Adjust to step size (truncate to valid increment)
        qty = Math.floor(qty / stepSize) * stepSize;

        // Ensure proper decimal precision
        return parseFloat(qty.toFixed(8));
    }
}