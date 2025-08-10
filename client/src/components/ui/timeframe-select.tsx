import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";
import type { Timeframe } from "@/features/account/interfaces/account.interfaces";

interface TimeframeOption<T = string> {
  value: T;
  label: string;
}

interface TimeframeSelectProps<T = string> {
  value: T;
  onValueChange: (value: T) => void;
  className?: string;
  placeholder?: string;
  size?: "default" | "sm" | "lg";
  variant?: "default" | "minimal";
  type?: "chart" | "bot";
}

const CHART_TIMEFRAME_OPTIONS: TimeframeOption<Timeframe>[] = [
  { value: "1minute", label: "1 Min" },
  { value: "3minute", label: "3 Min" },
  { value: "5minute", label: "5 Min" },
  { value: "15minute", label: "15 Min" },
  { value: "30minute", label: "30 Min" },
  { value: "hour", label: "1 Hour" },
  { value: "day", label: "1 Day" },
  { value: "week", label: "1 Week" },
  { value: "month", label: "1 Month" },
];

const BOT_TIMEFRAME_OPTIONS: TimeframeOption<string>[] = [
  { value: "1m", label: "1 minute" },
  { value: "3m", label: "3 minutes" },
  { value: "5m", label: "5 minutes" },
  { value: "15m", label: "15 minutes" },
  { value: "30m", label: "30 minutes" },
  { value: "1h", label: "1 hour" },
  { value: "2h", label: "2 hours" },
  { value: "4h", label: "4 hours" },
];

export const TimeframeSelect = <T extends string = string>({ value, onValueChange, className = "", placeholder = "Select timeframe", size = "default", variant = "default", type = "chart" }: TimeframeSelectProps<T>) => {
  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "w-32 h-8 text-xs";
      case "lg":
        return "w-48 h-12 text-base";
      default:
        return "w-40 h-10 text-sm";
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case "minimal":
        return "border-0 bg-transparent hover:bg-muted/50";
      default:
        return "";
    }
  };

  const options = type === "bot" ? BOT_TIMEFRAME_OPTIONS : CHART_TIMEFRAME_OPTIONS;

  return (
    <Select value={value as string} onValueChange={(val) => onValueChange(val as T)}>
      <SelectTrigger className={`${getSizeClasses()} ${getVariantClasses()} ${className}`}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value as string} value={option.value as string}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
