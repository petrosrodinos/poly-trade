import { useQuery } from "@tanstack/react-query";
import { getAccountIncome, getAccountIncomeChart, getAccountStatus, getAccountTrades, getIncomeChart } from "../services/account.service";

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
    });
};

export const useAccountIncomeChart = () => {
    return useQuery({
        queryKey: ["account-income-chart"],
        queryFn: getAccountIncomeChart,
    });
};

export const useIncomeChart = () => {
    return useQuery({
        queryKey: ["income-chart"],
        queryFn: getIncomeChart,
    });
};