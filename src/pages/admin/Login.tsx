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
    <div className="min-h-screen bg-gradient-to-br from-neutral-alabaster to-neutral-linen flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo/Title */}
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl font-bold text-neutral-charcoal mb-2">
            Almas Ceram
          </h1>
          <p className="text-neutral-slate text-lg">{t('auth.signIn')}</p>
        </div>

        {/* Login Card */}
        <div className="bg-card rounded-2xl p-8 shadow-card border border-neutral-stone/20">
          <h2 className="font-display text-2xl font-bold text-neutral-charcoal mb-6 text-center">
            {t('auth.welcomeBack')}
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-neutral-charcoal mb-2">
                {t('auth.email')}
              </label>
              <Input
                {...register('email')}
                type="email"
                placeholder={t('auth.emailPlaceholder')}
                className="text-base"
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-neutral-charcoal mb-2">
                {t('auth.password')}
              </label>
              <Input
                {...register('password')}
                type="password"
                placeholder={t('auth.passwordPlaceholder')}
                className="text-base"
                disabled={isLoading}
              />
              {errors.password && (
                <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-luxury-gold hover:bg-luxury-bronze text-neutral-charcoal font-semibold py-6 rounded-full text-base"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  {t('auth.signingIn')}
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5 mr-2" />
                  {t('auth.signIn')}
                </>
              )}
            </Button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-neutral-slate">
          <p>{t('auth.localBackend')}</p>
        </div>
      </div>
    </div>
  );
};

export default Login;