import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireManager?: boolean;
}

export const ProtectedRoute = ({ 
  children, 
  requireAdmin = false, 
  requireManager = false 
}: ProtectedRouteProps) => {
  const { isAuthenticated, isAdmin, isManager, loading, initialized } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!initialized || loading) return;

    if (!isAuthenticated()) {
      navigate('/auth', { replace: true });
      return;
    }

    if (requireAdmin && !isAdmin()) {
      navigate('/', { replace: true });
      return;
    }

    if (requireManager && !isManager()) {
      navigate('/', { replace: true });
      return;
    }
  }, [isAuthenticated, isAdmin, isManager, loading, initialized, navigate, requireAdmin, requireManager]);

  // Show loading spinner while authentication is being checked
  if (!initialized || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  // Don't render anything if not authenticated (navigation is happening)
  if (!isAuthenticated()) {
    return null;
  }

  // Don't render if access level requirements are not met
  if (requireAdmin && !isAdmin()) {
    return null;
  }

  if (requireManager && !isManager()) {
    return null;
  }

  return <>{children}</>;
};