import { useCallback } from "react";

export const useFormatters = () => {
    const formatCurrency = useCallback((amount: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 4,
            maximumFractionDigits: 4,
        }).format(amount);
    }, []);

    const formatPrice = useCallback((amount: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(amount);
    }, []);

    const formatNumber = useCallback((num: number) => {
        return new Intl.NumberFormat("en-US").format(num);
    }, []);

    const formatTimestamp = useCallback((timestamp: number) => {
        return new Date(timestamp).toLocaleString();
    }, []);

    const formatDate = useCallback((date: string) => {
        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    }, []);

    const formatDateTime = useCallback((date: string) => {
        return new Date(date).toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });
    }, []);

    return {
        formatCurrency,
        formatPrice,
        formatNumber,
        formatTimestamp,
        formatDate,
        formatDateTime,
    };
};
