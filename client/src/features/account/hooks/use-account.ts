import { useQuery } from "@tanstack/react-query";
import { getAccountIncome, getAccountIncomeChart, getAccountStatus, getAccountTrades } from "../services";

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