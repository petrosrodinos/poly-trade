import { BrokerIncome, BrokerTrade } from "../interfaces/brokers.interfaces";
import { AccountChartData, Timeframe, TradeProfitSummary } from "../../../modules/account/interfaces/account.interfaces";

export class BrokerAccountUtils {

    constructor() { }

    calculateTradesSummary(trades: BrokerTrade[]): TradeProfitSummary {
        if (trades.length === 0) {
            return {
                grossProfit: 0,
                commission: 0,
                netProfit: 0,
                averageProfit: 0,
                averageCommission: 0,
                trades: 0,
                winRate: 0,
                loseRate: 0
            };
        }

        let grossProfit = 0;
        let commission = 0;
        let wins = 0;
        let losses = 0;

        for (const trade of trades) {
            const pnl = parseFloat(trade.realizedPnl);
            grossProfit += pnl;
            commission += parseFloat(trade.commission);

            if (pnl > 0) {
                wins++;
            } else if (pnl < 0) {
                losses++;
            }
        }

        const totalTrades = trades.length;
        const winRate = wins / totalTrades;
        const loseRate = losses / totalTrades;

        return {
            grossProfit,
            commission,
            netProfit: grossProfit - commission,
            averageProfit: grossProfit / totalTrades,
            averageCommission: commission / totalTrades,
            trades: totalTrades,
            winRate,
            loseRate
        };
    }

    calculateIncomeSummary(incomes: BrokerIncome[]): TradeProfitSummary {
        if (incomes.length === 0) {
            return {
                grossProfit: 0,
                commission: 0,
                netProfit: 0,
                averageProfit: 0,
                averageCommission: 0,
                trades: 0,
                winRate: 0,
                loseRate: 0
            };
        }

        let grossProfit = 0;
        let commission = 0;
        let wins = 0;
        let losses = 0;

        for (const income of incomes) {
            if (income.incomeType === "REALIZED_PNL") {
                const pnl = parseFloat(income.income);
                grossProfit += pnl;

                if (pnl > 0) {
                    wins++;
                } else if (pnl < 0) {
                    losses++;
                }
            } else if (income.incomeType === "COMMISSION") {
                commission += Math.abs(parseFloat(income.income));
            }
        }

        const totalTrades = incomes.length;
        const winRate = wins / totalTrades;
        const loseRate = losses / totalTrades;

        return {
            grossProfit,
            commission,
            netProfit: grossProfit - commission,
            averageProfit: grossProfit / totalTrades,
            averageCommission: commission / totalTrades,
            trades: totalTrades,
            winRate,
            loseRate
        };
    }

    sortTrades(trades: BrokerTrade[]): BrokerTrade[] {
        return trades.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
    }

    sortIncomes(incomes: BrokerIncome[]): BrokerIncome[] {
        return incomes.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
    }

    calculateIncomeChart(
        incomes: BrokerIncome[],
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
            acc[key] += parseFloat(entry.income);

            return acc;
        }, {});

        return Object.entries(grouped).map(([time, value]) => ({
            time,
            value,
        }));
    }

    calculateTradesChart(trades: BrokerTrade[], timeframe: Timeframe = "hour"): AccountChartData[] {
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

            acc[key] += parseFloat(trade.realizedPnl) - parseFloat(trade.commission);

            return acc;
        }, {});

        return Object.entries(grouped).map(([time, value]) => ({
            time,
            value,
        }));
    }
}
