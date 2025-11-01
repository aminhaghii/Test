import { useState, useEffect, useRef } from 'react';
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
    <div className="min-h-screen bg-gradient-to-br from-neutral-alabaster to-neutral-linen flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo/Title */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="font-display text-4xl font-bold text-neutral-charcoal mb-2"
            >
              Almas Ceram
            </motion.h1>
          </Link>
          <p className="text-neutral-slate text-lg">Italian Excellence Since 1962</p>
        </div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-card/95 backdrop-blur-xl rounded-3xl p-8 md:p-10 shadow-2xl border border-neutral-stone/20"
        >
          <div className="text-center mb-8">
            <h2 className="font-display text-3xl font-bold text-neutral-charcoal mb-2">
              Welcome Back
            </h2>
            <p className="text-neutral-slate">
              Sign in to your account
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-neutral-charcoal">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-slate" />
                <Input
                  {...register('email')}
                  type="email"
                  placeholder="your@email.com"
                  className="pl-12 h-14 text-base border-2 focus:border-luxury-gold"
                  disabled={isLoading}
                />
              </div>
              {errors.email && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-600 text-sm flex items-center gap-1"
                >
                  {errors.email.message}
                </motion.p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-neutral-charcoal">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-slate" />
                <Input
                  {...register('password')}
                  type="password"
                  placeholder="Enter your password"
                  className="pl-12 h-14 text-base border-2 focus:border-luxury-gold"
                  disabled={isLoading}
                />
              </div>
              {errors.password && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
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
            <Button type="submit" className="w-full h-12" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <LogIn className="mr-2 h-4 w-4" />
              )}
              Sign In
            </Button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="h-px bg-neutral-stone/40 flex-1" />
            <span className="px-3 text-neutral-slate text-sm">or</span>
            <div className="h-px bg-neutral-stone/40 flex-1" />
          </div>

          {/* Google Button */}
          <div id="googleLoginBtn" className="flex justify-center" />
        </motion.div>

        <p className="text-center text-neutral-slate mt-6">
          Don’t have an account?{' '}
          <Link to="/register" className="text-neutral-charcoal underline underline-offset-4">Create one</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
