import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import testReports from '@/data/test-reports.json';
import { useLanguage } from '@/contexts/LanguageContext';
import MinimalBadgeIcon from './MinimalBadgeIcon';

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
            <div className="sticky top-0 z-20 bg-white border-b border-neutral-stone/30 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MinimalBadgeIcon
                  content={
                    <g transform="scale(0.5)">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" fill="none" stroke="currentColor" strokeWidth="2" />
                      <path d="M14 2v6h6" stroke="currentColor" strokeWidth="2" />
                      <path d="M16 13H8M16 17H8M10 9H8" stroke="currentColor" strokeWidth="1.5" />
                    </g>
                  }
                  bgColor="#222"
                  color="#fff"
                  size={32}
                />
                <h1 className="text-xl font-bold text-neutral-charcoal">{t('testReport.titlePrefix')} - {dimension}</h1>
              </div>
              
              <button
                onClick={onClose}
                className="p-2 hover:bg-neutral-slate/10 transition-colors"
              >
                <X className="w-5 h-5 text-neutral-charcoal" />
              </button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-100px)] p-6">
              <div className="space-y-6">
                {/* Specifications */}
                <div className="bg-neutral-slate/5 border border-neutral-stone/30 p-4">
                  <div className="flex items-center gap-3 mb-4">
                    <MinimalBadgeIcon
                      content="SP"
                      bgColor="#d3d3d3"
                      color="#222"
                      size={40}
                    />
                    <h2 className="text-lg font-semibold text-neutral-charcoal">{t('testReport.specifications')}</h2>
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
                        <div key={key} className="bg-white border-b border-neutral-stone/20 pb-2">
                          <span className="text-xs font-medium text-neutral-slate uppercase">{t(`testReport.specKey.${key}`) || key}</span>
                          <p className="text-sm font-semibold text-neutral-charcoal mt-1">{translatedValue}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Performance */}
                <div className="bg-neutral-slate/5 border border-neutral-stone/30 p-4">
                  <div className="flex items-center gap-3 mb-4">
                    <MinimalBadgeIcon
                      content="PF"
                      bgColor="#d3d3d3"
                      color="#222"
                      size={40}
                    />
                    <h2 className="text-lg font-semibold text-neutral-charcoal">{t('testReport.performance')}</h2>
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
                        <div key={key} className="bg-white border-b border-neutral-stone/20 pb-2">
                          <span className="text-xs font-medium text-neutral-slate uppercase">{t(`testReport.perfKey.${key}`) || key}</span>
                          <p className="text-sm font-semibold text-neutral-charcoal mt-1">{translatedValue}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Applications */}
                <div className="bg-neutral-slate/5 border border-neutral-stone/30 p-4">
                  <div className="flex items-center gap-3 mb-4">
                    <MinimalBadgeIcon
                      content={
                        <g transform="scale(0.5)">
                          <path d="M3 12l9-9 9 9M5 10v10h4v-6h6v6h4V10" fill="none" stroke="currentColor" strokeWidth="2" />
                        </g>
                      }
                      bgColor="#d3d3d3"
                      color="#222"
                      size={40}
                    />
                    <h2 className="text-lg font-semibold text-neutral-charcoal">{t('testReport.applications')}</h2>
                  </div>
                  
                  <div className="space-y-2">
                    {report.applications.map((app, index) => (
                      <div key={index} className="flex items-start gap-2 bg-white border-b border-neutral-stone/20 pb-2 hover:border-neutral-charcoal transition-colors">
                        <span className="text-sm text-neutral-slate">{t(`testReport.application.${app}`) || app}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <div className="bg-neutral-slate/5 border border-neutral-stone/30 p-4">
                  <div className="flex items-center gap-3 mb-4">
                    <MinimalBadgeIcon
                      content="TN"
                      bgColor="#222"
                      color="#fff"
                      size={40}
                    />
                    <h2 className="text-lg font-semibold text-neutral-charcoal">{t('testReport.technicalNotes')}</h2>
                  </div>
                  
                  <div className="space-y-2">
                    {report.technicalNotes.map((note, index) => (
                      <div key={index} className="flex items-start gap-2 bg-white border-b border-neutral-stone/20 pb-2">
                        <span className="text-xs font-semibold text-neutral-charcoal flex-shrink-0 mt-0.5">{index + 1}.</span>
                        <p className="text-sm text-neutral-slate">{t(`testReport.technicalNote.${note}`) || note}</p>
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

