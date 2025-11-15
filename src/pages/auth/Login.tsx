import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LogIn, Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/BackendAuthContext';
import toast from 'react-hot-toast';
import { Turnstile } from '@marsidev/react-turnstile';
import BrandLogo from '@/components/BrandLogo';

import { getApiUrl } from '@/lib/getApiUrl';
const API_URL = getApiUrl();
const SHOWCASE_IMAGE = `${API_URL}/DECORED/40%20x%2040/alborz3.jpg`;

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

type LoginFormData = z.infer<typeof loginSchema>;

declare global {
  interface Window {
    google?: any;
  }
}

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileKey, setTurnstileKey] = useState<string>('');
  const turnstileRef = useRef<any>(null);
  const { user, login, googleLogin } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  });

  useEffect(() => {
    const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY || '';
    setTurnstileKey(siteKey);
  }, []);

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      
      // Verify Turnstile if site key is configured
      if (turnstileKey && !turnstileToken) {
        toast.error('Please complete the security verification');
        setIsLoading(false);
        return;
      }
      
      await login(data.email, data.password, turnstileToken || undefined);
      toast.success('Welcome back!');
    } catch (error: unknown) {
      console.error('Login error:', error);
      const err = error as { message?: string };
      toast.error(err.message || 'Login failed. Please check your credentials.');
      // Reset Turnstile on error
      if (turnstileRef.current) {
        turnstileRef.current.reset();
        setTurnstileToken(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Initialize Google button
    if (!window.google) return;
    try {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
        callback: async (response: any) => {
          try {
            await googleLogin(response.credential);
            toast.success('Logged in with Google');
          } catch (e: any) {
            toast.error(e?.message || 'Google login failed');
          }
        },
      });
      const el = document.getElementById('googleLoginBtn');
      if (el) {
        window.google.accounts.id.renderButton(el, {
          theme: 'outline',
          size: 'large',
          shape: 'pill',
          width: 320,
        });
      }
    } catch (e) {
      // ignore init errors
    }
  }, [googleLogin]);

  return (
    <div className="min-h-screen bg-neutral-alabaster flex flex-col lg:flex-row">
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 py-8 sm:py-10 lg:px-16">
        <div className="w-full max-w-xl">
        {/* Logo/Title */}
          <div className="mb-6 sm:mb-8 md:mb-10">
            <Link to="/" className="inline-flex items-center justify-center">
              <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
                className="h-10 sm:h-12 md:h-14"
            >
                <BrandLogo className="h-10 sm:h-12 md:h-14 w-auto" eager />
              </motion.div>
          </Link>
        </div>

        {/* Login Card */}
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="bg-white/85 backdrop-blur-xl rounded-2xl sm:rounded-[24px] md:rounded-[32px] p-5 sm:p-6 md:p-8 lg:p-10 shadow-[0_40px_80px_-40px_rgba(16,24,40,0.35)] border border-white/60"
        >
            <div className="mb-6 sm:mb-7 md:mb-8">
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl tracking-tight text-neutral-charcoal mb-2 sm:mb-2.5 md:mb-3">
              Welcome Back
            </h2>
              <p className="text-neutral-slate text-sm sm:text-base">
                Access the Pietra Luxe Hub with your credentials
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5 md:space-y-6">
            {/* Email */}
            <div className="space-y-1.5 sm:space-y-2">
                <label className="block text-[10px] sm:text-xs font-semibold uppercase tracking-[0.3em] text-neutral-charcoal/70">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-neutral-slate" />
                <Input
                  {...register('email')}
                  type="email"
                    placeholder="you@pietraluxe.com"
                    className="pl-10 sm:pl-12 h-12 sm:h-13 md:h-14 text-base border-neutral-stone focus:border-neutral-charcoal focus:ring-0 touch-manipulation"
                    style={{ fontSize: '16px' }}
                  disabled={isLoading}
                />
              </div>
              {errors.email && (
                <motion.p 
                    initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-600 text-sm flex items-center gap-1"
                >
                  {errors.email.message}
                </motion.p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5 sm:space-y-2">
                <label className="block text-[10px] sm:text-xs font-semibold uppercase tracking-[0.3em] text-neutral-charcoal/70">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-neutral-slate" />
                <Input
                  {...register('password')}
                  type="password"
                  placeholder="Enter your password"
                    className="pl-10 sm:pl-12 h-12 sm:h-13 md:h-14 text-base border-neutral-stone focus:border-neutral-charcoal focus:ring-0 touch-manipulation"
                    style={{ fontSize: '16px' }}
                  disabled={isLoading}
                />
              </div>
              {errors.password && (
                <motion.p 
                    initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-600 text-sm flex items-center gap-1"
                >
                  {errors.password.message}
                </motion.p>
              )}
            </div>

            {/* Cloudflare Turnstile */}
            {turnstileKey && (
              <div className="flex justify-center">
                <Turnstile
                  ref={turnstileRef}
                  siteKey={turnstileKey}
                  onSuccess={(token) => setTurnstileToken(token)}
                  onError={() => {
                    toast.error('Security verification failed. Please try again.');
                    setTurnstileToken(null);
                  }}
                  onExpire={() => {
                    setTurnstileToken(null);
                  }}
                  options={{
                    theme: 'light',
                    size: 'normal',
                  }}
                />
              </div>
            )}

            {/* Submit */}
              <Button
                type="submit"
                className="w-full h-11 sm:h-12 bg-neutral-charcoal text-white hover:bg-neutral-charcoal/90 text-sm sm:text-base touch-manipulation"
                disabled={isLoading}
              >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <LogIn className="mr-2 h-4 w-4" />
              )}
              Sign In
            </Button>
          </form>

          {/* Divider */}
          <div className="my-5 sm:my-6 flex items-center">
            <div className="h-px bg-neutral-stone/40 flex-1" />
              <span className="px-2 sm:px-3 text-neutral-slate text-xs sm:text-sm uppercase tracking-[0.3em] sm:tracking-[0.4em]">
                Or
              </span>
            <div className="h-px bg-neutral-stone/40 flex-1" />
          </div>

          {/* Google Button */}
          <div id="googleLoginBtn" className="flex justify-center" />
        </motion.div>

          <p className="text-neutral-slate mt-4 sm:mt-5 md:mt-6 text-xs sm:text-sm text-center sm:text-left">
          Don't have an account?{' '}
            <Link to="/register" className="text-neutral-charcoal underline underline-offset-4">
              Create one
            </Link>
        </p>
        </div>
      </div>

      <div className="hidden lg:flex w-full lg:w-1/2 relative">
        <div className="absolute inset-0 bg-neutral-charcoal/10" />
        <img
          src={SHOWCASE_IMAGE}
          alt="Pietra Luxe showroom"
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent p-10 text-white">
          <p className="text-xs uppercase tracking-[0.5em] text-white/70">
            Crafted Surfaces
          </p>
          <h3 className="mt-3 text-3xl font-display tracking-[0.2em]">
            Tiles That Shape Luxury Spaces
          </h3>
        </div>
      </div>
    </div>
  );
};

export default Login;
