import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/BackendAuthContext';
import toast from 'react-hot-toast';

const Logout = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const performLogout = async () => {
      try {
        await logout();
        
        // Extra safety: clear all storage
        localStorage.clear();
        sessionStorage.clear();
        
        toast.success('با موفقیت خارج شدید');
        
        // Redirect to home
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 1000);
      } catch (error) {
        console.error('Logout error:', error);
        
        // Even if logout fails, clear storage and redirect
        localStorage.clear();
        sessionStorage.clear();
        toast.success('خارج شدید');
        
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 1000);
      }
    };

    performLogout();
  }, [logout, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-charcoal via-neutral-graphite to-neutral-slate">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-luxury-gold mx-auto mb-8"></div>
        <h2 className="text-3xl font-display text-white mb-4">
          در حال خروج...
        </h2>
        <p className="text-neutral-stone text-lg">
          لطفاً صبر کنید
        </p>
      </div>
    </div>
  );
};

export default Logout;

