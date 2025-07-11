interface NotificationBadgeProps {
  show: boolean;
}

export function NotificationBadge({ show }: NotificationBadgeProps) {
  if (!show) return null;

  return (
    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse border-2 border-white"></div>
  );
}