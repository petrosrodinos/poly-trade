import { ApiRoutes } from "@/config/api/routes";
import axiosInstance from "@/config/api/axios";
import type { AccountIncomeChart, AccountSummary, FuturesIncome, FuturesTrade, Timeframe } from "../interfaces/account.interfaces";

export const getAccountIncome = async (): Promise<FuturesIncome[]> => {
  try {
    const response = await axiosInstance.get(ApiRoutes.account.income);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAccountTrades = async (): Promise<FuturesTrade[]> => {
  try {
    const response = await axiosInstance.get(ApiRoutes.account.trades);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAccountStatus = async (): Promise<AccountSummary> => {
  try {
    const response = await axiosInstance.get(ApiRoutes.account.status);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAccountIncomeChart = async (): Promise<AccountIncomeChart[]> => {
  try {
    const response = await axiosInstance.get(ApiRoutes.account.income_chart);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getIncomeChart = async (timeframe: Timeframe = "1minute"): Promise<AccountIncomeChart[]> => {
  try {
    const response = await axiosInstance.get(ApiRoutes.account.income_chart, {
      params: { timeframe }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
