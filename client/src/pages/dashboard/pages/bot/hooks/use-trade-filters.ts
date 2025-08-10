import { useState, useMemo } from "react";
import type { FuturesTrade } from "@/features/account/interfaces/account.interfaces";

export type FilterState = {
    side: string;
    pnl: string;
    dateRange: string;
    sortByPnl: string;
};

interface UseTradeFiltersProps {
    trades: FuturesTrade[];
}

export const useTradeFilters = ({ trades }: UseTradeFiltersProps) => {
    const [filters, setFilters] = useState<FilterState>({
        side: "all",
        pnl: "all",
        dateRange: "all",
        sortByPnl: "none",
    });

    const [showFilters, setShowFilters] = useState(false);

    const filteredTrades = useMemo(() => {
        let filtered = [...trades];

        if (filters.side !== "all") {
            filtered = filtered.filter((trade) => trade.side === filters.side);
        }

        if (filters.pnl !== "all") {
            if (filters.pnl === "profit") {
                filtered = filtered.filter((trade) => parseFloat(trade.realizedPnl) > 0);
            } else if (filters.pnl === "loss") {
                filtered = filtered.filter((trade) => parseFloat(trade.realizedPnl) < 0);
            }
        }

        if (filters.dateRange !== "all") {
            const now = Date.now();
            const oneDayMs = 24 * 60 * 60 * 1000;
            const oneWeekMs = 7 * oneDayMs;
            const oneMonthMs = 30 * oneDayMs;

            filtered = filtered.filter((trade) => {
                const tradeTime = trade.time;
                switch (filters.dateRange) {
                    case "today":
                        return now - tradeTime <= oneDayMs;
                    case "week":
                        return now - tradeTime <= oneWeekMs;
                    case "month":
                        return now - tradeTime <= oneMonthMs;
                    default:
                        return true;
                }
            });
        }

        if (filters.sortByPnl !== "none") {
            filtered.sort((a, b) => {
                const pnlA = parseFloat(a.realizedPnl);
                const pnlB = parseFloat(b.realizedPnl);

                if (filters.sortByPnl === "asc") {
                    return pnlA - pnlB;
                } else if (filters.sortByPnl === "desc") {
                    return pnlB - pnlA;
                }
                return 0;
            });
        }

        return filtered;
    }, [trades, filters]);

    const activeFiltersCount = useMemo(() => {
        return Object.values(filters).filter((value) => value !== "all" && value !== "none").length;
    }, [filters]);

    const clearFilters = () => {
        setFilters({
            side: "all",
            pnl: "all",
            dateRange: "all",
            sortByPnl: "none",
        });
    };

    return {
        filters,
        setFilters,
        showFilters,
        setShowFilters,
        filteredTrades,
        activeFiltersCount,
        clearFilters,
    };
};
