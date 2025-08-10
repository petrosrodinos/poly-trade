import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis } from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { usePagination } from "@/hooks/usePagination";
import type { FuturesTrade } from "@/features/account/interfaces/account.interfaces";
import { useFormatters } from "@/pages/dashboard/hooks";
import { useTradeFilters } from "../hooks";
import { Filter, X } from "lucide-react";

interface TradesTableProps {
  trades?: FuturesTrade[];
  isLoading: boolean;
}

export const BotTrades = ({ trades, isLoading }: TradesTableProps) => {
  const { formatCurrency, formatTimestamp } = useFormatters();

  const displayTrades = trades && trades.length > 0 ? trades : [];

  const { filters, setFilters, showFilters, setShowFilters, filteredTrades, activeFiltersCount, clearFilters } = useTradeFilters({ trades: displayTrades });

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
    data: filteredTrades,
  });

  return (
    <Card className="h-fit">
      <CardHeader className="pb-3">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <CardTitle className="text-lg">Recent Trades</CardTitle>
            <div className="flex items-center gap-2">
              {filteredTrades.length > 0 && (
                <div className="text-sm text-slate-500">
                  Showing {startIndex}-{endIndex} of {filteredTrades.length}
                  {filteredTrades.length !== displayTrades.length && <span className="text-slate-400"> (filtered from {displayTrades.length})</span>}
                </div>
              )}
              <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-1 text-xs">
                <Filter className="h-3 w-3" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="ml-1 h-4 px-1 text-xs">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </div>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 p-3 bg-slate-50 rounded-lg">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">Sort by P&L</label>
                <Select value={filters.sortByPnl} onValueChange={(value) => setFilters((prev) => ({ ...prev, sortByPnl: value }))}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Sorting</SelectItem>
                    <SelectItem value="asc">Lowest to Highest</SelectItem>
                    <SelectItem value="desc">Highest to Lowest</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">Side</label>
                <Select value={filters.side} onValueChange={(value) => setFilters((prev) => ({ ...prev, side: value }))}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sides</SelectItem>
                    <SelectItem value="BUY">Buy</SelectItem>
                    <SelectItem value="SELL">Sell</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">P&L</label>
                <Select value={filters.pnl} onValueChange={(value) => setFilters((prev) => ({ ...prev, pnl: value }))}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All P&L</SelectItem>
                    <SelectItem value="profit">Profit Only</SelectItem>
                    <SelectItem value="loss">Loss Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">Date Range</label>
                <Select value={filters.dateRange} onValueChange={(value) => setFilters((prev) => ({ ...prev, dateRange: value }))}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {activeFiltersCount > 0 && (
                <div className="col-span-full flex justify-end">
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900">
                    <X className="h-3 w-3" />
                    Clear Filters
                  </Button>
                </div>
              )}
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
        ) : filteredTrades.length > 0 ? (
          <>
            <div className="space-y-3">
              {paginatedTrades.map((trade) => (
                <div key={trade.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 p-3 bg-slate-50 rounded-lg">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{trade.symbol}</div>
                      <div className="text-xs text-slate-500">{formatTimestamp(trade.time)}</div>
                    </div>
                    <Badge variant={trade.side === "BUY" ? "success" : "destructive"} className="text-xs w-fit">
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
          <div className="text-center py-6 text-slate-500 text-sm">
            {displayTrades.length === 0 ? "No trades found" : "No trades match the current filters"}
            {activeFiltersCount > 0 && (
              <div className="mt-2">
                <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs">
                  Clear filters to see all trades
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
