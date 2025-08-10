import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  height?: string;
  radius?: string;
  width?: string;
  items?: number;
}

export const Skeleton = ({ className, height, width, radius, items }: SkeletonProps) => {
  const itemsArray = Array.from({ length: items || 1 });

  return (
    <div className={cn("animate-pulse rounded-md bg-gray-200 dark:bg-gray-800", className)} style={{ height, width, borderRadius: radius }}>
      {itemsArray.map((_, index) => (
        <div key={index} className={cn("animate-pulse rounded-md bg-gray-200 dark:bg-gray-800", className)} style={{ height, width, borderRadius: radius }} />
      ))}
    </div>
  );
};
