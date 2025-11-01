import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, BarChart3, TestTube, ClipboardList, Target, Building } from 'lucide-react';
import testReports from '../../backend/test-reports.json';
import { useLanguage } from '@/contexts/LanguageContext';

interface TestReportModalProps {
  dimension: string;
  isOpen: boolean;
  onClose: () => void;
}

const TestReportModal: React.FC<TestReportModalProps> = ({
  dimension,
  isOpen,
  onClose
}) => {
  const { t } = useLanguage();
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const report = testReports[dimension as keyof typeof testReports];

  if (!report) {
    return null;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-3xl max-h-[90vh] bg-white rounded-lg overflow-hidden shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 z-20 bg-blue-600 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5" />
                <h1 className="text-xl font-bold">{t('testReport.titlePrefix')} - {dimension}</h1>
              </div>
              
              <button
                onClick={onClose}
                className="p-2 hover:bg-blue-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-100px)] p-6">
              <div className="space-y-6">
                {/* Specifications */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center gap-2 mb-4">
                    <ClipboardList className="w-5 h-5 text-blue-600" />
                    <h2 className="text-lg font-bold text-gray-900">{t('testReport.specifications')}</h2>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(report.specifications).map(([key, value]) => {
                      // Try to translate value, with fallback to original
                      let translatedValue = value as string;
                      const valueKey = `testReport.specValue.${value}`;
                      const translated = t(valueKey);
                      if (translated && translated !== valueKey) {
                        translatedValue = translated;
                      } else {
                        // For values with "Min", try to translate just the "Min" part
                        if (typeof value === 'string' && value.startsWith('Min ')) {
                          const numberPart = value.replace('Min ', '');
                          const translatedMin = t('testReport.min');
                          translatedValue = `${translatedMin} ${numberPart}`;
                        } else {
                          translatedValue = value as string;
                        }
                      }
                      return (
                        <div key={key} className="bg-white rounded p-3 border border-gray-200">
                          <span className="text-xs font-semibold text-gray-600 uppercase">{t(`testReport.specKey.${key}`) || key}</span>
                          <p className="text-sm font-bold text-gray-900 mt-1">{translatedValue}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Performance */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center gap-2 mb-4">
                    <BarChart3 className="w-5 h-5 text-green-600" />
                    <h2 className="text-lg font-bold text-gray-900">{t('testReport.performance')}</h2>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(report.performanceData).map(([key, value]) => {
                      // Try to translate value, with fallback to original
                      let translatedValue = value as string;
                      const valueKey = `testReport.perfValue.${value}`;
                      const translated = t(valueKey);
                      if (translated && translated !== valueKey) {
                        translatedValue = translated;
                      } else {
                        translatedValue = value as string;
                      }
                      return (
                        <div key={key} className="bg-white rounded p-3 border border-gray-200">
                          <span className="text-xs font-semibold text-gray-600 uppercase">{t(`testReport.perfKey.${key}`) || key}</span>
                          <p className="text-sm font-medium text-gray-900 mt-1">{translatedValue}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Applications */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center gap-2 mb-4">
                    <Building className="w-5 h-5 text-purple-600" />
                    <h2 className="text-lg font-bold text-gray-900">{t('testReport.applications')}</h2>
                  </div>
                  
                  <div className="space-y-2">
                    {report.applications.map((app, index) => (
                      <div key={index} className="flex items-start gap-2 bg-white rounded p-2 border border-gray-200 hover:border-purple-300 transition-colors">
                        <Target className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{t(`testReport.application.${app}`) || app}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center gap-2 mb-4">
                    <TestTube className="w-5 h-5 text-amber-600" />
                    <h2 className="text-lg font-bold text-gray-900">{t('testReport.technicalNotes')}</h2>
                  </div>
                  
                  <div className="space-y-2">
                    {report.technicalNotes.map((note, index) => (
                      <div key={index} className="flex items-start gap-2 bg-white rounded p-2 border border-gray-200">
                        <span className="text-xs font-bold text-amber-700 flex-shrink-0 mt-0.5">{index + 1}.</span>
                        <p className="text-sm text-gray-700">{t(`testReport.technicalNote.${note}`) || note}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TestReportModal;

