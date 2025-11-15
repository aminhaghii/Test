import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  UserPlus,
  Mail,
  Lock,
  User,
  Loader2,
  ArrowRight,
  Phone,
  Globe2,
  ClipboardList,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/BackendAuthContext';
import toast from 'react-hot-toast';
import BrandLogo from '@/components/BrandLogo';
import { cn } from '@/lib/utils';

import { getApiUrl } from '@/lib/getApiUrl';
import { getImageUrl } from '@/lib/getImageUrl';
const API_URL = getApiUrl();
const REGISTER_IMAGE = `getImageUrl('/DECORED/60X120/CARLO%20dark%202.jpg')`;

const registerSchema = z
  .object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
    user_type: z.enum(['personal', 'company'], { required_error: 'Please select account type' }),
  company_name: z.string().optional(),
  employee_count: z.string().optional(),
  industry: z.string().optional(),
  primary_use_case: z.string().optional(),
  phone: z.string().optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  budget_range: z.string().optional(),
  project_timeline: z.string().optional(),
    how_heard_about_us: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
    path: ['confirmPassword'],
  })
  .refine(
    (data) => {
  if (data.user_type === 'company' && !data.company_name) {
    return false;
  }
  return true;
    },
    {
      message: 'Company name is required for company accounts',
      path: ['company_name'],
    },
  );

type RegisterFormData = z.infer<typeof registerSchema>;

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { register: registerUser } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const userType = watch('user_type');

  const steps = useMemo(
    () => [
      {
        id: 'account',
        title: 'Account Details',
        description: 'Create your secure credentials.',
        fields: ['name', 'email', 'password', 'confirmPassword', 'user_type'] as (keyof RegisterFormData)[],
      },
      {
        id: 'profile',
        title: 'Profile Information',
        description: 'Help us understand your background.',
        fields: ['company_name', 'phone', 'country'] as (keyof RegisterFormData)[],
      },
      {
        id: 'project',
        title: 'Project Preferences',
        description: 'Tailor the experience to your needs.',
        fields: ['industry', 'primary_use_case', 'budget_range', 'project_timeline', 'how_heard_about_us'] as (keyof RegisterFormData)[],
      },
    ],
    [],
  );

  const isLastStep = currentStep === steps.length - 1;

  const handleNext = async () => {
    const fieldsToValidate = steps[currentStep].fields;
    const valid = await trigger(fieldsToValidate, { shouldFocus: true });
    if (valid) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const onSubmit = async (data: RegisterFormData) => {
    try {
      if (!acceptedTerms) {
        toast.error('Please accept the terms and privacy policy to continue.');
        return;
      }
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
        how_heard_about_us: data.how_heard_about_us,
      });
      
      toast.success('Account created successfully!');
    } catch (error: unknown) {
      console.error('Register error:', error);
      const err = error as { message?: string };
      toast.error(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-alabaster flex flex-col lg:flex-row">
      <div className="w-full lg:w-1/2 px-4 sm:px-6 lg:px-16 py-6 sm:py-8 md:py-10 lg:py-16 flex items-stretch">
        <div className="w-full max-w-2xl mx-auto flex flex-col">
          <Link to="/" className="self-center mb-6 sm:mb-8 md:mb-10 lg:mb-12">
        <motion.div
              initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="h-12 sm:h-14 md:h-16"
            >
              <BrandLogo className="h-12 sm:h-14 md:h-16 w-auto" eager />
            </motion.div>
          </Link>

          <div className="mb-6 sm:mb-8 md:mb-10 lg:mb-12">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4 justify-center md:justify-start">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center gap-2 sm:gap-3">
                  <div
                    className={cn(
                      'h-9 w-9 sm:h-10 sm:w-10 md:h-11 md:w-11 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold transition-all duration-300 border touch-manipulation',
                      index === currentStep
                        ? 'bg-neutral-charcoal text-white border-neutral-charcoal shadow-lg shadow-neutral-charcoal/20'
                        : index < currentStep
                        ? 'bg-neutral-charcoal/90 text-white border-neutral-charcoal'
                        : 'bg-white text-neutral-slate border-neutral-stone',
                    )}
                  >
                    {index + 1}
                  </div>
                  <div className="hidden md:block">
                    <p className="text-xs uppercase tracking-[0.3em] text-neutral-charcoal/60">{step.title}</p>
                    <p className="text-xs text-neutral-slate">{step.description}</p>
                  </div>
                  {index < steps.length - 1 && <div className="h-px w-4 sm:w-6 md:w-8 lg:w-16 bg-neutral-stone/60" />}
                </div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white/85 backdrop-blur-xl rounded-2xl sm:rounded-[24px] md:rounded-[32px] p-5 sm:p-6 md:p-8 lg:p-10 shadow-[0_40px_80px_-40px_rgba(16,24,40,0.35)] border border-white/60 flex-1 flex flex-col"
          >
            <div className="mb-6 sm:mb-7 md:mb-8">
              <h1 className="font-display text-2xl sm:text-3xl md:text-4xl tracking-tight text-neutral-charcoal">
                {steps[currentStep].title}
              </h1>
              <p className="text-neutral-slate mt-1.5 sm:mt-2 text-sm sm:text-base">{steps[currentStep].description}</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col">
              <AnimatePresence mode="wait">
                <motion.div
                  key={steps[currentStep].id}
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 40 }}
                  transition={{ duration: 0.35, ease: 'easeInOut' }}
                  className="flex-1 space-y-4 sm:space-y-5 md:space-y-6"
                >
                  {steps[currentStep].id === 'account' && (
                    <>
              <div className="space-y-1.5 sm:space-y-2">
                        <label className="block text-[10px] sm:text-xs font-semibold uppercase tracking-[0.3em] text-neutral-charcoal/70">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-neutral-slate" />
                  <Input
                    {...register('name')}
                    type="text"
                            placeholder="Your full name"
                            className="pl-10 sm:pl-12 h-12 sm:h-13 md:h-14 text-base border-neutral-stone focus:border-neutral-charcoal focus:ring-0 touch-manipulation"
                            style={{ fontSize: '16px' }}
                    disabled={isLoading}
                  />
                </div>
                {errors.name && (
                          <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-red-600 text-sm">
                    {errors.name.message}
                  </motion.p>
                )}
              </div>

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
                          <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-red-600 text-sm">
                    {errors.email.message}
                  </motion.p>
                )}
              </div>

                      <div className="grid md:grid-cols-2 md:gap-6 gap-4 sm:gap-6">
              <div className="space-y-1.5 sm:space-y-2">
                          <label className="block text-[10px] sm:text-xs font-semibold uppercase tracking-[0.3em] text-neutral-charcoal/70">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-neutral-slate" />
                  <Input
                    {...register('password')}
                    type="password"
                    placeholder="••••••••"
                              className="pl-10 sm:pl-12 h-12 sm:h-13 md:h-14 text-base border-neutral-stone focus:border-neutral-charcoal focus:ring-0 touch-manipulation"
                              style={{ fontSize: '16px' }}
                    disabled={isLoading}
                  />
                </div>
                {errors.password && (
                            <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-red-600 text-xs sm:text-sm">
                    {errors.password.message}
                  </motion.p>
                )}
              </div>
              <div className="space-y-1.5 sm:space-y-2">
                          <label className="block text-[10px] sm:text-xs font-semibold uppercase tracking-[0.3em] text-neutral-charcoal/70">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-neutral-slate" />
                  <Input
                    {...register('confirmPassword')}
                    type="password"
                              placeholder="Repeat password"
                              className="pl-10 sm:pl-12 h-12 sm:h-13 md:h-14 text-base border-neutral-stone focus:border-neutral-charcoal focus:ring-0 touch-manipulation"
                              style={{ fontSize: '16px' }}
                    disabled={isLoading}
                  />
                </div>
                {errors.confirmPassword && (
                            <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-red-600 text-sm">
                    {errors.confirmPassword.message}
                  </motion.p>
                )}
              </div>
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                        <label className="block text-[10px] sm:text-xs font-semibold uppercase tracking-[0.3em] text-neutral-charcoal/70">
                  Account Type *
                </label>
                <select
                  {...register('user_type')}
                          className="w-full h-12 sm:h-13 md:h-14 px-3 sm:px-4 text-base border border-neutral-stone rounded-full focus:border-neutral-charcoal focus:outline-none bg-white touch-manipulation"
                          style={{ fontSize: '16px' }}
                  disabled={isLoading}
                >
                  <option value="">Select account type</option>
                  <option value="personal">Personal</option>
                  <option value="company">Company</option>
                </select>
                {errors.user_type && (
                          <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-red-600 text-sm">
                    {errors.user_type.message}
                  </motion.p>
                )}
              </div>
                    </>
                  )}

                  {steps[currentStep].id === 'profile' && (
                    <>
              <div className="space-y-1.5 sm:space-y-2">
                        <label className="block text-[10px] sm:text-xs font-semibold uppercase tracking-[0.3em] text-neutral-charcoal/70">
                          Company Name {userType === 'company' && <span className="text-neutral-charcoal/50">*</span>}
                </label>
                        {userType === 'company' ? (
                <Input
                  {...register('company_name')}
                  type="text"
                  placeholder="Your company name"
                            className="h-12 sm:h-13 md:h-14 text-base border-neutral-stone focus:border-neutral-charcoal focus:ring-0 touch-manipulation"
                            style={{ fontSize: '16px' }}
                  disabled={isLoading}
                />
                        ) : (
                          <div className="h-12 sm:h-13 md:h-14 rounded-xl sm:rounded-2xl border border-dashed border-neutral-stone flex items-center justify-between px-3 sm:px-4 text-xs sm:text-sm text-neutral-slate/70">
                            <span className="flex-1">Switch to "Company" account type to add business information.</span>
                            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 ml-2" />
                          </div>
                        )}
                        {errors.company_name && userType === 'company' && (
                          <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-red-600 text-xs sm:text-sm">
                    {errors.company_name.message}
                  </motion.p>
                )}
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                        <label className="block text-[10px] sm:text-xs font-semibold uppercase tracking-[0.3em] text-neutral-charcoal/70">
                  Phone Number
                </label>
                        <div className="relative">
                          <Phone className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-neutral-slate" />
                <Input
                  {...register('phone')}
                  type="tel"
                  placeholder="+98 XXX XXX XXXX"
                            className="pl-10 sm:pl-12 h-12 sm:h-13 md:h-14 text-base border-neutral-stone focus:border-neutral-charcoal focus:ring-0 touch-manipulation"
                            style={{ fontSize: '16px' }}
                  disabled={isLoading}
                />
                        </div>
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                        <label className="block text-[10px] sm:text-xs font-semibold uppercase tracking-[0.3em] text-neutral-charcoal/70">
                  Country
                </label>
                        <div className="relative">
                          <Globe2 className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-neutral-slate" />
                <Input
                  {...register('country')}
                  type="text"
                            placeholder="Country"
                            className="pl-10 sm:pl-12 h-12 sm:h-13 md:h-14 text-base border-neutral-stone focus:border-neutral-charcoal focus:ring-0 touch-manipulation"
                            style={{ fontSize: '16px' }}
                  disabled={isLoading}
                />
              </div>
              </div>
                    </>
                  )}

                  {steps[currentStep].id === 'project' && (
                    <>
              <div className="space-y-1.5 sm:space-y-2">
                        <label className="block text-[10px] sm:text-xs font-semibold uppercase tracking-[0.3em] text-neutral-charcoal/70">
                  Industry
                </label>
                <select
                  {...register('industry')}
                          className="w-full h-12 sm:h-13 md:h-14 px-3 sm:px-4 text-base border border-neutral-stone rounded-full focus:border-neutral-charcoal focus:outline-none bg-white touch-manipulation"
                          style={{ fontSize: '16px' }}
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

                      <div className="space-y-1.5 sm:space-y-2">
                        <label className="block text-[10px] sm:text-xs font-semibold uppercase tracking-[0.3em] text-neutral-charcoal/70">
                          Primary Use Case
                        </label>
                        <div className="relative">
                          <ClipboardList className="absolute left-3 sm:left-4 top-3 sm:top-4 w-4 h-4 sm:w-5 sm:h-5 text-neutral-slate" />
                          <textarea
                            {...register('primary_use_case')}
                            rows={4}
                            placeholder="Describe how you plan to use Pietra Luxe surfaces..."
                            className="pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 w-full resize-none text-base border border-neutral-stone rounded-2xl sm:rounded-3xl focus:border-neutral-charcoal focus:outline-none focus:ring-0 bg-white/80 touch-manipulation"
                            style={{ fontSize: '16px' }}
                            disabled={isLoading}
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 md:gap-6 gap-4 sm:gap-6">
              <div className="space-y-1.5 sm:space-y-2">
                          <label className="block text-[10px] sm:text-xs font-semibold uppercase tracking-[0.3em] text-neutral-charcoal/70">
                  Budget Range
                </label>
                <select
                  {...register('budget_range')}
                            className="w-full h-12 sm:h-13 md:h-14 px-3 sm:px-4 text-base border border-neutral-stone rounded-full focus:border-neutral-charcoal focus:outline-none bg-white touch-manipulation"
                            style={{ fontSize: '16px' }}
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
              <div className="space-y-1.5 sm:space-y-2">
                          <label className="block text-[10px] sm:text-xs font-semibold uppercase tracking-[0.3em] text-neutral-charcoal/70">
                  Project Timeline
                </label>
                <select
                  {...register('project_timeline')}
                            className="w-full h-12 sm:h-13 md:h-14 px-3 sm:px-4 text-base border border-neutral-stone rounded-full focus:border-neutral-charcoal focus:outline-none bg-white touch-manipulation"
                            style={{ fontSize: '16px' }}
                  disabled={isLoading}
                >
                  <option value="">Select timeline</option>
                  <option value="immediate">Immediate (0-1 month)</option>
                            <option value="short">1-3 months</option>
                            <option value="medium">3-6 months</option>
                            <option value="long">6+ months</option>
                  <option value="planning">Just planning</option>
                </select>
                        </div>
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                        <label className="block text-[10px] sm:text-xs font-semibold uppercase tracking-[0.3em] text-neutral-charcoal/70">
                  How did you hear about us?
                </label>
                <select
                  {...register('how_heard_about_us')}
                          className="w-full h-12 sm:h-13 md:h-14 px-3 sm:px-4 text-base border border-neutral-stone rounded-full focus:border-neutral-charcoal focus:outline-none bg-white touch-manipulation"
                          style={{ fontSize: '16px' }}
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

                      <div className="flex items-start gap-2 sm:gap-3 text-xs sm:text-sm bg-neutral-alabaster/70 border border-neutral-stone/30 rounded-xl sm:rounded-2xl p-3 sm:p-4">
                        <input
                          type="checkbox"
                          className="mt-0.5 sm:mt-1 rounded border-neutral-stone text-neutral-charcoal focus:ring-neutral-charcoal touch-manipulation"
                          checked={acceptedTerms}
                          onChange={(event) => setAcceptedTerms(event.target.checked)}
                          disabled={isLoading}
                          required
                        />
                        <p className="text-neutral-slate">
                          I agree to the{' '}
                          <Link to="/terms" className="text-neutral-charcoal font-semibold underline underline-offset-4">
                            Terms of Service
                          </Link>{' '}
                          and{' '}
                          <Link to="/privacy" className="text-neutral-charcoal font-semibold underline underline-offset-4">
                            Privacy Policy
                          </Link>
                          .
                        </p>
                      </div>
                    </>
                  )}
                </motion.div>
              </AnimatePresence>

              <div className="mt-8 sm:mt-10 md:mt-12 lg:mt-14 flex flex-col gap-4 sm:gap-5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                  {currentStep > 0 ? (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handlePrevious}
                      className="w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 rounded-full border-neutral-stone text-neutral-charcoal hover:bg-neutral-stone/20 text-sm sm:text-base touch-manipulation"
                      disabled={isLoading}
                    >
                      Back
                    </Button>
                  ) : (
                    <span className="hidden sm:block" />
                  )}

                  {!isLastStep && (
                    <Button
                      type="button"
                      onClick={handleNext}
                      className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 rounded-full bg-neutral-charcoal text-white hover:bg-neutral-charcoal/90 text-sm sm:text-base touch-manipulation"
                      disabled={isLoading}
                    >
                      Continue
                    </Button>
                  )}

                  {isLastStep && (
              <Button
                type="submit"
                disabled={isLoading}
                      className="w-full sm:w-auto px-8 sm:px-10 py-2.5 sm:py-3 rounded-full bg-neutral-charcoal text-white hover:bg-neutral-charcoal/90 flex items-center justify-center text-sm sm:text-base touch-manipulation"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Create Account
                  </>
                )}
              </Button>
                  )}
            </div>

                <p className="text-xs sm:text-sm text-neutral-slate text-center">
                Already have an account?{' '}
                  <Link to="/login" className="text-neutral-charcoal underline underline-offset-4">
                    Sign in
                </Link>
              </p>
            </div>
            </form>
          </motion.div>

          <div className="text-center mt-10">
            <Link 
              to="/" 
              className="text-neutral-slate hover:text-neutral-charcoal text-sm inline-flex items-center gap-2 group"
            >
              <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>

      <div className="hidden lg:flex w-full lg:w-1/2 relative">
        <div className="absolute inset-0 bg-neutral-charcoal/10" />
        <img
          src={REGISTER_IMAGE}
          alt="Pietra Luxe registration showcase"
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent p-10 text-white">
          <p className="text-xs uppercase tracking-[0.5em] text-white/70">Premium Surfaces</p>
          <h3 className="mt-3 text-3xl font-display tracking-[0.2em]">Register to unlock curated resources</h3>
        </div>
      </div>
    </div>
  );
};

export default Register;

