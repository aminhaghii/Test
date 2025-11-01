import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, User, ChevronRight, Mail, Lock, Phone, Globe, Users, Briefcase } from 'lucide-react';
import { authService, RegisterData } from '@/services/authService';

interface EnhancedRegistrationFormProps {
  onSuccess: (user: any) => void;
  onSwitchToLogin: () => void;
}

const EnhancedRegistrationForm: React.FC<EnhancedRegistrationFormProps> = ({
  onSuccess,
  onSwitchToLogin
}) => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState<RegisterData>({
    email: '',
    password: '',
    name: '',
    user_type: undefined,
    company_name: '',
    employee_count: '',
    industry: '',
    primary_use_case: ''
  });

  const handleInputChange = (field: keyof RegisterData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleNext = () => {
    if (step === 1) {
      if (!formData.email || !formData.password || !formData.name) {
        setError('Please fill in all required fields');
        return;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }
    }
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError('');

    try {
      const user = await authService.register(formData);
      onSuccess(user);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const industries = [
    'Construction',
    'Interior Design',
    'Architecture',
    'Retail',
    'Real Estate',
    'Contractor',
    'Other'
  ];

  const employeeCounts = [
    '1-10',
    '11-50',
    '51-200',
    '200+'
  ];

  const useCases = [
    'Residential',
    'Commercial',
    'Both'
  ];

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">Step {step} of 3</span>
          <span className="text-sm text-gray-500">{Math.round((step / 3) * 100)}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-luxury-gold to-luxury-bronze h-2 rounded-full transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
      </div>

      {/* Step 1: Basic Information */}
      {step === 1 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-6"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-luxury-gold to-luxury-bronze rounded-2xl flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Your Account</h2>
            <p className="text-gray-600">Let's start with your basic information</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxury-gold focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxury-gold focus:border-transparent"
                  placeholder="Enter your email address"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxury-gold focus:border-transparent"
                  placeholder="Create a secure password"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Step 2: Business Information */}
      {step === 2 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-6"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-luxury-gold to-luxury-bronze rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Tell Us About Your Business</h2>
            <p className="text-gray-600">Help us understand your needs better</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Are you registering as: *
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleInputChange('user_type', 'personal')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    formData.user_type === 'personal'
                      ? 'border-luxury-gold bg-luxury-gold/10'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <User className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                  <span className="font-medium">Personal</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleInputChange('user_type', 'company')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    formData.user_type === 'company'
                      ? 'border-luxury-gold bg-luxury-gold/10'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Building2 className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                  <span className="font-medium">Company</span>
                </button>
              </div>
            </div>

            {formData.user_type === 'company' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name *
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.company_name}
                      onChange={(e) => handleInputChange('company_name', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxury-gold focus:border-transparent"
                      placeholder="Enter your company name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Employees
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                      value={formData.employee_count}
                      onChange={(e) => handleInputChange('employee_count', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxury-gold focus:border-transparent"
                    >
                      <option value="">Select employee count</option>
                      {employeeCounts.map(count => (
                        <option key={count} value={count}>{count}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Industry *
              </label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={formData.industry}
                  onChange={(e) => handleInputChange('industry', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxury-gold focus:border-transparent"
                >
                  <option value="">Select your industry</option>
                  {industries.map(industry => (
                    <option key={industry} value={industry}>{industry}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Primary Use Case *
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={formData.primary_use_case}
                  onChange={(e) => handleInputChange('primary_use_case', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxury-gold focus:border-transparent"
                >
                  <option value="">Select primary use case</option>
                  {useCases.map(useCase => (
                    <option key={useCase} value={useCase}>{useCase}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Step 3: Review & Complete */}
      {step === 3 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-6"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-luxury-gold to-luxury-bronze rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ChevronRight className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Review Your Information</h2>
            <p className="text-gray-600">Please review and confirm your details</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm font-medium text-gray-600">Name:</span>
                <p className="text-gray-900">{formData.name}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Email:</span>
                <p className="text-gray-900">{formData.email}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Account Type:</span>
                <p className="text-gray-900 capitalize">{formData.user_type}</p>
              </div>
              {formData.user_type === 'company' && formData.company_name && (
                <div>
                  <span className="text-sm font-medium text-gray-600">Company:</span>
                  <p className="text-gray-900">{formData.company_name}</p>
                </div>
              )}
              {formData.employee_count && (
                <div>
                  <span className="text-sm font-medium text-gray-600">Employees:</span>
                  <p className="text-gray-900">{formData.employee_count}</p>
                </div>
              )}
              <div>
                <span className="text-sm font-medium text-gray-600">Industry:</span>
                <p className="text-gray-900">{formData.industry}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Use Case:</span>
                <p className="text-gray-900">{formData.primary_use_case}</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center mt-8">
        <div>
          {step > 1 && (
            <button
              type="button"
              onClick={handleBack}
              className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
            >
              ← Back
            </button>
          )}
        </div>

        <div className="flex gap-3">
          {step < 3 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-8 py-3 bg-gradient-to-r from-luxury-gold to-luxury-bronze text-white rounded-lg hover:from-luxury-bronze hover:to-luxury-gold transition-all duration-200 font-medium"
            >
              Next →
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="px-8 py-3 bg-gradient-to-r from-luxury-gold to-luxury-bronze text-white rounded-lg hover:from-luxury-bronze hover:to-luxury-gold transition-all duration-200 font-medium disabled:opacity-50"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          )}
        </div>
      </div>

      {/* Login Link */}
      <div className="text-center mt-6">
        <p className="text-gray-600">
          Already have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-luxury-gold hover:text-luxury-bronze font-medium transition-colors"
          >
            Sign in here
          </button>
        </p>
      </div>
    </div>
  );
};

export default EnhancedRegistrationForm;
