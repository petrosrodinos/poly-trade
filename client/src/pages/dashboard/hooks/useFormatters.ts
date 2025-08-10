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
