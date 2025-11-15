import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LogIn, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/BackendAuthContext';
import toast from 'react-hot-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import BrandLogo from '@/components/BrandLogo';

// Note: Schema validation messages are in English as Zod validation happens before component render
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

type LoginFormData = z.infer<typeof loginSchema>;

const Login = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { user, login } = useAuth();

  // Redirect if already logged in as admin
  // Redirect if already logged in as admin - REMOVED to prevent auto-redirect
  // useEffect(() => {
  //   if (user && user.role === 'admin') {
  //     navigate('/admin');
  //   }
  // }, [user, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      await login(data.email, data.password);
      
      toast.success(t('auth.loginSuccess'));
      
      // Navigation will be handled by useEffect above
    } catch (error: unknown) {
      console.error('Login error:', error);
      const err = error as { message?: string };
      toast.error(err.message || t('auth.loginFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-alabaster to-neutral-linen flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md">
        {/* Logo/Title */}
        <div className="text-center mb-6 sm:mb-8">
          <BrandLogo className="h-10 sm:h-12 md:h-14 w-auto mx-auto mb-2" eager />
          <p className="text-neutral-slate text-sm sm:text-base md:text-lg">{t('auth.signIn')}</p>
        </div>

        {/* Login Card */}
        <div className="bg-card rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 shadow-card border border-neutral-stone/20">
          <h2 className="font-display text-xl sm:text-2xl font-bold text-neutral-charcoal mb-4 sm:mb-5 md:mb-6 text-center">
            {t('auth.welcomeBack')}
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5 md:space-y-6">
            {/* Email */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-neutral-charcoal mb-1.5 sm:mb-2">
                {t('auth.email')}
              </label>
              <Input
                {...register('email')}
                type="email"
                placeholder={t('auth.emailPlaceholder')}
                className="text-base h-11 sm:h-12 md:h-13 touch-manipulation"
                style={{ fontSize: '16px' }}
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-red-600 text-xs sm:text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-neutral-charcoal mb-1.5 sm:mb-2">
                {t('auth.password')}
              </label>
              <Input
                {...register('password')}
                type="password"
                placeholder={t('auth.passwordPlaceholder')}
                className="text-base h-11 sm:h-12 md:h-13 touch-manipulation"
                style={{ fontSize: '16px' }}
                disabled={isLoading}
              />
              {errors.password && (
                <p className="text-red-600 text-xs sm:text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-luxury-gold hover:bg-luxury-bronze text-neutral-charcoal font-semibold py-3 sm:py-4 md:py-6 rounded-full text-sm sm:text-base touch-manipulation"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2 animate-spin" />
                  {t('auth.signingIn')}
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />
                  {t('auth.signIn')}
                </>
              )}
            </Button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-4 sm:mt-5 md:mt-6 text-xs sm:text-sm text-neutral-slate">
          <p>{t('auth.localBackend')}</p>
        </div>
      </div>
    </div>
  );
};

export default Login;