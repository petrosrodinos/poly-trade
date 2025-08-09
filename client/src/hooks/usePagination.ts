import { useState, useMemo } from "react";

interface UsePaginationProps<T> {
    data: T[];
}

interface UsePaginationReturn<T> {
    currentPage: number;
    totalPages: number;
    paginatedData: T[];
    startIndex: number;
    endIndex: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    goToPage: (page: number) => void;
    goToNextPage: () => void;
    goToPreviousPage: () => void;
    reset: () => void;
}

export function usePagination<T>({
    data,
}: UsePaginationProps<T>): UsePaginationReturn<T> {
    const itemsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);

    const paginationData = useMemo(() => {
        const totalPages = Math.ceil(data.length / itemsPerPage);
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedData = data.slice(startIndex, endIndex);

        return {
            totalPages,
            paginatedData,
            startIndex: data.length > 0 ? startIndex + 1 : 0,
            endIndex: Math.min(endIndex, data.length),
        };
    }, [data, currentPage, itemsPerPage]);

    const hasNextPage = currentPage < paginationData.totalPages;
    const hasPreviousPage = currentPage > 1;

    const goToPage = (page: number) => {
        const targetPage = Math.max(1, Math.min(page, paginationData.totalPages));
        setCurrentPage(targetPage);
    };

    const goToNextPage = () => {
        if (hasNextPage) {
            setCurrentPage((prev) => prev + 1);
        }
    };

    const goToPreviousPage = () => {
        if (hasPreviousPage) {
            setCurrentPage((prev) => prev - 1);
        }
    };

    const reset = () => {
        setCurrentPage(1);
    };

    return {
        currentPage,
        totalPages: paginationData.totalPages,
        paginatedData: paginationData.paginatedData,
        startIndex: paginationData.startIndex,
        endIndex: paginationData.endIndex,
        hasNextPage,
        hasPreviousPage,
        goToPage,
        goToNextPage,
        goToPreviousPage,
        reset,
    };
}
