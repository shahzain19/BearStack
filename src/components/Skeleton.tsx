export const Skeleton = ({ className = '' }: { className?: string }) => (
  <div className={`animate-pulse rounded bg-[rgba(0,0,0,0.06)] ${className}`} />
);
