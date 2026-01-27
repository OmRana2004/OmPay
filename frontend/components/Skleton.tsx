type SkeletonProps = {
  height?: string;
  width?: string;
  className?: string;
};

export default function Skeleton({
  height = "h-4",
  width = "w-full",
  className = "",
}: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-gray-200 rounded ${height} ${width} ${className}`}
    />
  );
}
