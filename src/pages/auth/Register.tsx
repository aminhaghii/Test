import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserPlus, Mail, Lock, User, Loader2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/BackendAuthContext';
import toast from 'react-hot-toast';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  user_type: z.enum(['personal', 'company'], { required_error: 'Please select user type' }),
  company_name: z.string().optional(),
  employee_count: z.string().optional(),
  industry: z.string().optional(),
  primary_use_case: z.string().optional(),
  phone: z.string().optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  budget_range: z.string().optional(),
  project_timeline: z.string().optional(),
  how_heard_about_us: z.string().optional()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
}).refine((data) => {
  if (data.user_type === 'company' && !data.company_name) {
    return false;
  }
  return true;
}, {
  message: "Company name is required for company accounts",
  path: ["company_name"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

const Register = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { user, register: registerUser } = useAuth();

  // Redirect if already logged in - REMOVED to prevent auto-redirect
  // useEffect(() => {
  //   if (user) {
  //     if (user.role === 'admin') {
  //       navigate('/admin');
  //     } else {
  //       navigate('/');
  //     }
  //   }
  // }, [user, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema)
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true);
      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
        user_type: data.user_type,
        company_name: data.company_name,
        employee_count: data.employee_count,
        industry: data.industry,
        primary_use_case: data.primary_use_case,
        phone: data.phone,
        country: data.country,
        city: data.city,
        budget_range: data.budget_range,
        project_timeline: data.project_timeline,
        how_heard_about_us: data.how_heard_about_us
      });
      
      toast.success('Account created successfully!');
      
      // Navigation will be handled by useEffect above
    } catch (error: unknown) {
      console.error('Register error:', error);
      const err = error as { message?: string };
      toast.error(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-alabaster via-neutral-linen to-neutral-parchment relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-luxury-gold/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-luxury-bronze/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-luxury-brass/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Logo/Title */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-block">
              <motion.h1 
                className="font-display text-5xl font-bold bg-gradient-to-r from-luxury-gold via-luxury-bronze to-luxury-brass bg-clip-text text-transparent mb-2"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                Almas Ceram
              </motion.h1>
            </Link>
            <p className="text-neutral-slate text-lg">Join Our Luxury Community</p>
          </div>

          {/* Register Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-card/95 backdrop-blur-xl rounded-3xl p-8 md:p-10 shadow-2xl border border-neutral-stone/20"
          >
            <div className="text-center mb-8">
              <h2 className="font-display text-3xl font-bold text-neutral-charcoal mb-2">
                Create Account
              </h2>
              <p className="text-neutral-slate">
                Start your journey with us
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Name */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-neutral-charcoal">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-slate" />
                  <Input
                    {...register('name')}
                    type="text"
                    placeholder="John Doe"
                    className="pl-12 h-14 text-base border-2 focus:border-luxury-gold"
                    disabled={isLoading}
                  />
                </div>
                {errors.name && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-600 text-sm"
                  >
                    {errors.name.message}
                  </motion.p>
                )}
              </div>

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
                    className="text-red-600 text-sm"
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
                    placeholder="••••••••"
                    className="pl-12 h-14 text-base border-2 focus:border-luxury-gold"
                    disabled={isLoading}
                  />
                </div>
                {errors.password && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-600 text-sm"
                  >
                    {errors.password.message}
                  </motion.p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-neutral-charcoal">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-slate" />
                  <Input
                    {...register('confirmPassword')}
                    type="password"
                    placeholder="••••••••"
                    className="pl-12 h-14 text-base border-2 focus:border-luxury-gold"
                    disabled={isLoading}
                  />
                </div>
                {errors.confirmPassword && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-600 text-sm"
                  >
                    {errors.confirmPassword.message}
                  </motion.p>
                )}
              </div>

              {/* Terms */}
              <div className="flex items-start gap-2 text-sm">
                <input 
                  type="checkbox" 
                  required
                  className="mt-0.5 rounded border-neutral-stone text-luxury-gold focus:ring-luxury-gold"
                />
                <p className="text-neutral-slate">
                  I agree to the{' '}
                  <Link to="/terms" className="text-luxury-gold hover:text-luxury-bronze font-medium">
                    Terms of Service
                  </Link>
                  {' '}and{' '}
                  <Link to="/privacy" className="text-luxury-gold hover:text-luxury-bronze font-medium">
                    Privacy Policy
                  </Link>
                </p>
              </div>

              {/* User Type */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-neutral-charcoal">
                  Account Type *
                </label>
                <select
                  {...register('user_type')}
                  className="w-full h-14 px-4 text-base border-2 border-neutral-stone/30 rounded-full focus:border-luxury-gold focus:outline-none bg-white"
                  disabled={isLoading}
                >
                  <option value="">Select account type</option>
                  <option value="personal">Personal</option>
                  <option value="company">Company</option>
                </select>
                {errors.user_type && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-600 text-sm"
                  >
                    {errors.user_type.message}
                  </motion.p>
                )}
              </div>

              {/* Company Name (conditional) */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-neutral-charcoal">
                  Company Name
                </label>
                <Input
                  {...register('company_name')}
                  type="text"
                  placeholder="Your company name"
                  className="h-14 text-base border-2 focus:border-luxury-gold"
                  disabled={isLoading}
                />
                {errors.company_name && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-600 text-sm"
                  >
                    {errors.company_name.message}
                  </motion.p>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-neutral-charcoal">
                  Phone Number
                </label>
                <Input
                  {...register('phone')}
                  type="tel"
                  placeholder="+98 XXX XXX XXXX"
                  className="h-14 text-base border-2 focus:border-luxury-gold"
                  disabled={isLoading}
                />
              </div>

              {/* Country */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-neutral-charcoal">
                  Country
                </label>
                <Input
                  {...register('country')}
                  type="text"
                  placeholder="Iran"
                  className="h-14 text-base border-2 focus:border-luxury-gold"
                  disabled={isLoading}
                />
              </div>

              {/* City */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-neutral-charcoal">
                  City
                </label>
                <Input
                  {...register('city')}
                  type="text"
                  placeholder="Tehran"
                  className="h-14 text-base border-2 focus:border-luxury-gold"
                  disabled={isLoading}
                />
              </div>

              {/* Industry */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-neutral-charcoal">
                  Industry
                </label>
                <select
                  {...register('industry')}
                  className="w-full h-14 px-4 text-base border-2 border-neutral-stone/30 rounded-full focus:border-luxury-gold focus:outline-none bg-white"
                  disabled={isLoading}
                >
                  <option value="">Select industry</option>
                  <option value="construction">Construction</option>
                  <option value="architecture">Architecture</option>
                  <option value="interior_design">Interior Design</option>
                  <option value="real_estate">Real Estate</option>
                  <option value="contractor">Contractor</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Budget Range */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-neutral-charcoal">
                  Budget Range
                </label>
                <select
                  {...register('budget_range')}
                  className="w-full h-14 px-4 text-base border-2 border-neutral-stone/30 rounded-full focus:border-luxury-gold focus:outline-none bg-white"
                  disabled={isLoading}
                >
                  <option value="">Select budget range</option>
                  <option value="under_10k">Under $10,000</option>
                  <option value="10k_50k">$10,000 - $50,000</option>
                  <option value="50k_100k">$50,000 - $100,000</option>
                  <option value="100k_500k">$100,000 - $500,000</option>
                  <option value="over_500k">Over $500,000</option>
                </select>
              </div>

              {/* Project Timeline */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-neutral-charcoal">
                  Project Timeline
                </label>
                <select
                  {...register('project_timeline')}
                  className="w-full h-14 px-4 text-base border-2 border-neutral-stone/30 rounded-full focus:border-luxury-gold focus:outline-none bg-white"
                  disabled={isLoading}
                >
                  <option value="">Select timeline</option>
                  <option value="immediate">Immediate (0-1 month)</option>
                  <option value="short">Short term (1-3 months)</option>
                  <option value="medium">Medium term (3-6 months)</option>
                  <option value="long">Long term (6+ months)</option>
                  <option value="planning">Just planning</option>
                </select>
              </div>

              {/* How heard about us */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-neutral-charcoal">
                  How did you hear about us?
                </label>
                <select
                  {...register('how_heard_about_us')}
                  className="w-full h-14 px-4 text-base border-2 border-neutral-stone/30 rounded-full focus:border-luxury-gold focus:outline-none bg-white"
                  disabled={isLoading}
                >
                  <option value="">Select option</option>
                  <option value="google">Google Search</option>
                  <option value="social_media">Social Media</option>
                  <option value="referral">Referral</option>
                  <option value="trade_show">Trade Show</option>
                  <option value="website">Website</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-luxury-gold to-luxury-bronze hover:from-luxury-bronze hover:to-luxury-gold text-neutral-charcoal font-semibold h-14 rounded-full text-base shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5 mr-2" />
                    Create Account
                  </>
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-stone/30" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-card text-neutral-slate">or</span>
              </div>
            </div>

            {/* Login Link */}
            <div className="text-center">
              <p className="text-neutral-slate">
                Already have an account?{' '}
                <Link 
                  to="/login" 
                  className="text-luxury-gold hover:text-luxury-bronze font-semibold inline-flex items-center gap-1 group"
                >
                  Sign In
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </p>
            </div>
          </motion.div>

          {/* Back to Home */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center mt-6"
          >
            <Link 
              to="/" 
              className="text-neutral-slate hover:text-neutral-charcoal text-sm inline-flex items-center gap-2 group"
            >
              <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
