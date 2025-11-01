import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/BackendAuthContext';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
  redirectTo?: string;
}

const AuthGuard = ({ 
  children, 
  requireAuth = false, 
  requireAdmin = false, 
  redirectTo = '/' 
}: AuthGuardProps) => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isLoading) return; // Wait for auth to load

    // If auth is required but user is not logged in
    if (requireAuth && !user) {
      navigate('/login');
      return;
    }

    // If admin is required but user is not admin
    if (requireAdmin && (!user || user.role !== 'admin')) {
      navigate('/');
      return;
    }

    // If user is logged in and trying to access login/register pages
    if (user && (location.pathname === '/login' || location.pathname === '/register')) {
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
      return;
    }

    // If user is admin and trying to access admin login
    if (user && user.role === 'admin' && location.pathname === '/admin/login') {
      navigate('/admin');
      return;
    }

  }, [user, isLoading, requireAuth, requireAdmin, navigate, location.pathname]);

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-luxury-gold"></div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthGuard;
