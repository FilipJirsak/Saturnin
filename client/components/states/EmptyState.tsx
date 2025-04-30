import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  message: string;
  className?: string;
}

export function EmptyState({ icon: Icon, message, className = "" }: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-8 text-surface-500 ${className}`}>
      <Icon className="h-12 w-12 text-surface-300 mb-2" />
      <p>{message}</p>
    </div>
  );
}
