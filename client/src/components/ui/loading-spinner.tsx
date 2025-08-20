import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  size?: number;
  className?: string;
}

export default function LoadingSpinner({ size = 24, className = "" }: LoadingSpinnerProps) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 size={size} className={`animate-spin ${className}`} />
    </div>
  );
}
