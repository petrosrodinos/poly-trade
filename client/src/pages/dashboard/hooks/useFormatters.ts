import { useCallback } from "react";

export const useFormatters = () => {
    const formatCurrency = useCallback((amount: number) => {
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

    return {
        formatCurrency,
        formatNumber,
        formatTimestamp,
    };
};
