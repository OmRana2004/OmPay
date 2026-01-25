export default function Skeleton({ height = "h-4" }: { height?: string }) {
  return (
    <div
      className={`animate-pulse bg-gray-200 rounded ${height}`}
    />
  );
}
