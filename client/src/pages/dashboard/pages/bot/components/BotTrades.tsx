import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis } from "@/components/ui/pagination";
import { usePagination } from "@/hooks/usePagination";
import type { FuturesTrade } from "@/features/account/interfaces/account.interfaces";
import { useFormatters } from "@/pages/dashboard/hooks";

interface TradesTableProps {
  trades?: FuturesTrade[];
  isLoading: boolean;
}

export const BotTrades = ({ trades, isLoading }: TradesTableProps) => {
  const { formatCurrency, formatTimestamp } = useFormatters();

  const displayTrades = trades && trades.length > 0 ? trades : [];

  const {
    currentPage,
    totalPages,
    paginatedData: paginatedTrades,
    startIndex,
    endIndex,
    hasNextPage,
    hasPreviousPage,
    goToPage,
    goToNextPage,
    goToPreviousPage,
  } = usePagination({
    data: displayTrades,
  });

  return (
    <Card className="h-fit">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <CardTitle className="text-lg">Recent Trades</CardTitle>
          {displayTrades.length > 0 && (
            <div className="text-sm text-slate-500">
              Showing {startIndex}-{endIndex} of {displayTrades.length}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading ? (
          <div className="flex items-center justify-center py-6">
            <Spinner size="sm" />
            <span className="ml-2 text-sm text-slate-500">Loading trades...</span>
          </div>
        ) : displayTrades.length > 0 ? (
          <>
            <div className="space-y-3">
              {paginatedTrades.map((trade) => (
                <div key={trade.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 p-3 bg-slate-50 rounded-lg">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{trade.symbol}</div>
                      <div className="text-xs text-slate-500">{formatTimestamp(trade.time)}</div>
                    </div>
                    <Badge variant={trade.side === "BUY" ? "default" : "destructive"} className="text-xs w-fit">
                      {trade.side}
                    </Badge>
                  </div>
                  <div className="flex justify-between sm:block sm:text-right">
                    <div className="text-sm font-medium">{formatCurrency(parseFloat(trade.price))}</div>
                    <div className={`text-xs ${parseFloat(trade.realizedPnl) >= 0 ? "text-green-600" : "text-red-600"}`}>{formatCurrency(parseFloat(trade.realizedPnl))}</div>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="pt-3 border-t border-slate-200">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault();
                          goToPreviousPage();
                        }}
                        className={!hasPreviousPage ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>

                    {Array.from({ length: totalPages }, (_, i) => {
                      const pageNum = i + 1;
                      const isVisible = pageNum === 1 || pageNum === totalPages || (pageNum >= currentPage - 1 && pageNum <= currentPage + 1);

                      if (!isVisible) {
                        if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                          return (
                            <PaginationItem key={pageNum}>
                              <PaginationEllipsis />
                            </PaginationItem>
                          );
                        }
                        return null;
                      }

                      return (
                        <PaginationItem key={pageNum}>
                          <PaginationLink
                            href="#"
                            size="sm"
                            onClick={(e) => {
                              e.preventDefault();
                              goToPage(pageNum);
                            }}
                            isActive={currentPage === pageNum}
                          >
                            {pageNum}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}

                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault();
                          goToNextPage();
                        }}
                        className={!hasNextPage ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-6 text-slate-500 text-sm">No trades found</div>
        )}
      </CardContent>
    </Card>
  );
};
