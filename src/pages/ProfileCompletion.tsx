import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight, User, Building2 } from 'lucide-react';
import UserProfilePanel from '@/components/auth/UserProfilePanel';
import { useAuth } from '@/contexts/BackendAuthContext';

interface ProfileCompletionPageProps {
  onComplete?: () => void;
}

const ProfileCompletionPage: React.FC<ProfileCompletionPageProps> = ({ onComplete }) => {
  const { user, updateProfile } = useAuth();
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (user && user.profile_completion_percentage >= 80) {
      setIsCompleted(true);
    }
  }, [user]);

  const handleProfileUpdate = (updatedUser: any) => {
    if (updatedUser.profile_completion_percentage >= 80) {
      setIsCompleted(true);
      setTimeout(() => {
        onComplete?.();
      }, 2000);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-luxury-gold"></div>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md mx-auto"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle2 className="w-12 h-12 text-white" />
          </motion.div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Profile Complete!
          </h1>
          
          <p className="text-gray-600 mb-6">
            Thank you for completing your profile. You now have access to all features.
          </p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-center gap-2 text-luxury-gold"
          >
            <span>Redirecting to dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Complete Your Profile</h1>
              <p className="text-gray-600">Help us understand your needs better</p>
            </div>
            
            <div className="text-right">
              <div className="text-2xl font-bold text-luxury-gold">
                {user.profile_completion_percentage}%
              </div>
              <div className="text-sm text-gray-500">Complete</div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${user.profile_completion_percentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-2 bg-gradient-to-r from-luxury-gold to-luxury-bronze rounded-full"
            />
          </div>
        </div>
      </div>

      {/* Profile Panel */}
      <div className="py-8">
        <UserProfilePanel onProfileUpdate={handleProfileUpdate} />
      </div>

      {/* Benefits Section */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Why Complete Your Profile?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Personalized Experience
              </h3>
              <p className="text-gray-600">
                Get tailored product recommendations based on your preferences and industry.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Business Solutions
              </h3>
              <p className="text-gray-600">
                Access specialized tools and resources for your business needs.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Priority Support
              </h3>
              <p className="text-gray-600">
                Get faster response times and dedicated support for your projects.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCompletionPage;
