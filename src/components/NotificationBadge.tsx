interface NotificationBadgeProps {
  show: boolean;
}

export function NotificationBadge({ show }: NotificationBadgeProps) {
  if (!show) return null;

  return (
    <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full animate-pulse border-2 border-white shadow-lg"></div>
  );
}