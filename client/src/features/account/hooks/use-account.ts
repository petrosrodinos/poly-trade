import { useQuery } from "@tanstack/react-query";
import { getAccountIncome, getAccountStatus, getAccountTrades, getIncomeChart } from "../services/account.service";
import type { Timeframe } from "../interfaces/account.interfaces";

export const useAccountIncome = () => {
    return useQuery({
        queryKey: ["account-income"],
        queryFn: getAccountIncome,
    });
};

export const useAccountTrades = () => {
    return useQuery({
        queryKey: ["account-trades"],
        queryFn: getAccountTrades,
    });
};

export const useAccountStatus = () => {
    return useQuery({
        queryKey: ["account-status"],
        queryFn: getAccountStatus,
        retry: false,
    });
};


export const useIncomeChart = (timeframe: Timeframe = "1minute") => {
    return useQuery({
        queryKey: ["income-chart", timeframe],
        queryFn: () => getIncomeChart(timeframe),
        retry: false,
    });
};