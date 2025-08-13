import React from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from "chart.js";
import { Line } from "react-chartjs-2";
import { useIncomeChart } from "@/features/account/hooks/use-account";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { TimeframeSelect } from "@/components/ui/timeframe-select";
import { TrendingUp, TrendingDown, Activity, RotateCcw } from "lucide-react";
import type { Timeframe } from "@/features/account/interfaces/account.interfaces";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

interface IncomeChartProps {
  className?: string;
  title?: string;
  showLegend?: boolean;
  height?: number;
}

export function IncomeChart({ className = "", title = "Income Chart", height = 300 }: IncomeChartProps) {
  const [selectedTimeframe, setSelectedTimeframe] = React.useState<Timeframe>("1minute");
  const { data: incomeData, isLoading, error, refetch, isRefetching } = useIncomeChart(selectedTimeframe);
  const chartId = React.useMemo(() => `income-chart-${Math.random().toString(36).substr(2, 9)}`, []);

  const stats = React.useMemo(() => {
    if (!incomeData || incomeData.length === 0) return null;

    const values = incomeData.map((item) => item.value);
    const latest = values[values.length - 1];
    const previous = values[values.length - 2];
    const total = values.reduce((sum, val) => sum + val, 0);
    const trend = previous ? ((latest - previous) / Math.abs(previous)) * 100 : 0;

    return { latest, total, trend };
  }, [incomeData]);

  // Memoize colors to avoid DOM manipulation on every render
  const colors = React.useMemo(() => {
    if (typeof window === "undefined") {
      return {
        chart1: "rgb(100, 149, 237)",
        background: "rgb(255, 255, 255)",
        destructive: "rgb(239, 68, 68)",
      };
    }

    // Simple fallback colors that work with Canvas
    return {
      chart1: "rgb(165, 132, 82)", // chart-1 fallback
      background: "rgb(255, 255, 255)", // background fallback
      destructive: "rgb(239, 68, 68)", // red fallback
    };
  }, []);

  const chartData = React.useMemo(() => {
    if (!incomeData || incomeData.length === 0) {
      return {
        labels: [],
        datasets: [],
      };
    }

    const labels = incomeData.map((item) => item.time);
    const values = incomeData.map((item) => item.value);

    return {
      labels,
      datasets: [
        {
          label: "Income",
          data: values,
          borderColor: colors.chart1,
          backgroundColor: colors.chart1.replace("rgb", "rgba").replace(")", ", 0.1)"),
          borderWidth: 2,
          fill: true,
          tension: 0.3,
          pointBackgroundColor: colors.background,
          pointBorderColor: colors.chart1,
          pointBorderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 6,
          pointHoverBorderWidth: 2,
        },
      ],
    };
  }, [incomeData, colors]);

  const options = React.useMemo(() => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        intersect: false,
        mode: "index" as const,
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          enabled: true,
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          titleColor: "white",
          bodyColor: "white",
          borderColor: "rgba(255, 255, 255, 0.1)",
          borderWidth: 1,
          cornerRadius: 8,
          callbacks: {
            label: function (context: any) {
              const value = context.parsed.y;
              return `Income: $${value.toFixed(2)}`;
            },
          },
        },
      },
      scales: {
        x: {
          display: true,
          grid: {
            display: false,
          },
          border: {
            display: false,
          },
          ticks: {
            color: "rgba(107, 114, 128, 1)", // gray-500 fallback
            font: {
              size: 12,
              weight: "normal" as const,
            },
            maxTicksLimit: 6,
          },
        },
        y: {
          display: true,
          position: "right" as const,
          grid: {
            color: "rgba(229, 231, 235, 0.3)", // gray-200 with opacity
            lineWidth: 1,
          },
          border: {
            display: false,
          },
          ticks: {
            color: "rgba(107, 114, 128, 1)", // gray-500 fallback
            font: {
              size: 12,
              weight: "normal" as const,
            },
            callback: function (value: any) {
              return `$${Number(value).toLocaleString()}`;
            },
            maxTicksLimit: 5,
          },
        },
      },
      elements: {
        point: {
          hoverRadius: 6,
        },
      },
      animation: {
        duration: 750,
        easing: "easeInOutCubic" as const,
      },
    };
  }, []);

  if (isLoading) {
    return (
      <Card className={`group hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-gradient-to-br from-background to-muted/20 ${className}`}>
        <CardHeader className="pb-3">
          <div className="space-y-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                <CardTitle className="text-lg font-semibold flex items-center gap-2 min-w-0">
                  <Activity className="w-5 h-5 text-chart-1 flex-shrink-0" />
                  <span className="break-words leading-tight">{title}</span>
                </CardTitle>
                <div className="flex-shrink-0">
                  <TimeframeSelect value={selectedTimeframe} onValueChange={setSelectedTimeframe} size="sm" />
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => refetch()} className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground flex-shrink-0">
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center justify-center" style={{ height }}>
            <div className="flex flex-col items-center gap-3">
              <Spinner />
              <p className="text-sm text-muted-foreground animate-pulse">Loading chart data...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={`group hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-gradient-to-br from-background to-muted/20 ${className}`}>
        <CardHeader className="pb-3">
          <div className="space-y-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                <CardTitle className="text-lg font-semibold flex items-center gap-2 min-w-0">
                  <Activity className="w-5 h-5 text-destructive flex-shrink-0" />
                  <span className="break-words leading-tight">{title}</span>
                </CardTitle>
                <div className="flex-shrink-0">
                  <TimeframeSelect value={selectedTimeframe} onValueChange={setSelectedTimeframe} size="sm" />
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => refetch()} disabled={isRefetching} className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground flex-shrink-0">
                <RotateCcw className={`h-4 w-4 ${isRefetching ? "animate-spin" : ""}`} />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center justify-center text-muted-foreground" style={{ height }}>
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                <Activity className="w-6 h-6 text-destructive" />
              </div>
              <p className="text-sm">Failed to load chart data</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!incomeData || incomeData.length === 0) {
    return (
      <Card className={`group hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-gradient-to-br from-background to-muted/20 ${className}`}>
        <CardHeader className="pb-3">
          <div className="space-y-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                <CardTitle className="text-lg font-semibold flex items-center gap-2 min-w-0">
                  <Activity className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  <span className="break-words leading-tight">{title}</span>
                </CardTitle>
                <div className="flex-shrink-0">
                  <TimeframeSelect value={selectedTimeframe} onValueChange={setSelectedTimeframe} size="sm" />
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => refetch()} disabled={isRefetching} className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground flex-shrink-0">
                <RotateCcw className={`h-4 w-4 ${isRefetching ? "animate-spin" : ""}`} />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center justify-center text-muted-foreground" style={{ height }}>
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                <Activity className="w-6 h-6 text-muted-foreground" />
              </div>
              <p className="text-sm">No data available</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`group hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-gradient-to-br from-background to-muted/20 backdrop-blur-sm ${className}`}>
      <CardHeader className="pb-3">
        <div className="space-y-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              <CardTitle className="text-lg font-semibold flex items-center gap-2 min-w-0">
                <Activity className="w-5 h-5 text-chart-1 flex-shrink-0" />
                <span className="break-words leading-tight">{title}</span>
              </CardTitle>
              <div className="flex-shrink-0">
                <TimeframeSelect value={selectedTimeframe} onValueChange={setSelectedTimeframe} size="sm" />
              </div>
            </div>
            <div className="flex items-center justify-between sm:justify-end gap-4">
              {stats && (
                <div className="text-left sm:text-right">
                  <p className="text-xl sm:text-2xl font-bold text-foreground break-all sm:break-normal" title={`$${stats.latest.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}>
                    ${stats.latest.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                  <div className={`flex items-center gap-1 text-sm font-medium ${stats.trend >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                    {stats.trend >= 0 ? <TrendingUp className="w-4 h-4 flex-shrink-0" /> : <TrendingDown className="w-4 h-4 flex-shrink-0" />}
                    <span>{Math.abs(stats.trend).toFixed(1)}%</span>
                  </div>
                </div>
              )}
              <Button variant="ghost" size="sm" onClick={() => refetch()} className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground flex-shrink-0">
                <RotateCcw className={`h-4 w-4 ${isRefetching ? "animate-spin" : ""}`} />
              </Button>
            </div>
          </div>
        </div>
        {stats && (
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-6 mt-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-2 h-2 rounded-full bg-chart-1 flex-shrink-0"></div>
              <span className="truncate" title={`Total: $${stats.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}>
                Total: ${stats.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-2 h-2 rounded-full bg-chart-2 flex-shrink-0"></div>
              <span className="truncate">{incomeData.length} data points</span>
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent className="pt-0">
        <div style={{ height }} className="relative">
          <Line key={chartId} data={chartData} options={options} />
        </div>
      </CardContent>
    </Card>
  );
}
