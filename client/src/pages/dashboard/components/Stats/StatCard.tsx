import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import type { LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";

interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: LucideIcon;
  gradientFrom: string;
  gradientTo: string;
  isLoading?: boolean;
}

const AnimatedValue = ({ value, isLoading }: { value: string; isLoading: boolean }) => {
  const [displayValue, setDisplayValue] = useState("0");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isLoading) {
      setDisplayValue("0");
      setIsVisible(false);
      return;
    }

    const numericValue = parseFloat(value.replace(/[^0-9.-]/g, ""));
    const prefix = value.replace(/[0-9.-]/g, "");

    if (isNaN(numericValue)) {
      setDisplayValue(value);
      setIsVisible(true);
      return;
    }

    setIsVisible(true);

    const duration = 1000;
    const steps = 60;
    const stepDuration = duration / steps;
    let currentStep = 0;

    const animate = () => {
      const progress = currentStep / steps;
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const currentValue = numericValue * easedProgress;

      setDisplayValue(prefix + (numericValue % 1 === 0 ? Math.floor(currentValue).toString() : currentValue.toFixed(2)));

      currentStep++;
      if (currentStep <= steps) {
        setTimeout(animate, stepDuration);
      }
    };

    animate();
  }, [value, isLoading]);

  return <span className={`transition-all duration-300 ${isVisible ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-2"}`}>{displayValue}</span>;
};

export const StatCard = ({ title, value, subtitle, icon: Icon, gradientFrom, gradientTo, isLoading = false }: StatCardProps) => {
  return (
    <Card className={`border-0 shadow-lg bg-gradient-to-br ${gradientFrom} ${gradientTo} text-white`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium opacity-90">{title}</CardTitle>
        <Icon className="h-4 w-4 opacity-90" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold flex items-center gap-2 min-h-[2rem]">
          {isLoading ? (
            <>
              <Spinner size="sm" className="text-white" />
              <span className="text-lg">Loading...</span>
            </>
          ) : (
            <AnimatedValue value={value} isLoading={isLoading} />
          )}
        </div>
        <p className="text-xs opacity-90 mt-1 transition-opacity duration-300">{subtitle}</p>
      </CardContent>
    </Card>
  );
};
