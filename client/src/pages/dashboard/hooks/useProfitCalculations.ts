import { useMemo } from "react";
import type { AccountSummary } from "@/features/account/interfaces/account.interfaces";

export const useProfitCalculations = (accountStatus?: AccountSummary) => {
    const profitPercentage = useMemo(() => {
        if (!accountStatus?.totalWalletBalance || !accountStatus?.income.netProfit) return 0;
        return (accountStatus.income.netProfit / accountStatus.totalWalletBalance) * 100;
    }, [accountStatus?.totalWalletBalance, accountStatus?.income.netProfit]);

    const isProfit = useMemo(() => profitPercentage >= 0, [profitPercentage]);

    return {
        profitPercentage,
        isProfit,
    };
};
