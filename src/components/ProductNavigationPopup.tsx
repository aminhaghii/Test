import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Grid3X3, Home, ChefHat, Bath, Sofa } from 'lucide-react';

interface ProductNavigationPopupProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  onCategorySelect: (category: string) => void;
}

const categories = [
  {
    id: 'floor-tiles',
    name: 'Floor tiles',
    icon: Grid3X3,
    description: 'Premium flooring solutions',
    color: 'from-luxury-gold to-luxury-bronze'
  },
  {
    id: 'wall-tiles',
    name: 'Wall tiles',
    icon: Home,
    description: 'Elegant wall coverings',
    color: 'from-luxury-gold to-luxury-brass'
  },
  {
    id: 'kitchens',
    name: 'Kitchens',
    icon: ChefHat,
    description: 'Kitchen design solutions',
    color: 'from-luxury-gold to-luxury-bronze'
  },
  {
    id: 'bathroom',
    name: 'Bathroom',
    icon: Bath,
    description: 'Luxury bathroom designs',
    color: 'from-luxury-gold to-luxury-bronze'
  },
  {
    id: 'other-interiors',
    name: 'Other interiors',
    icon: Sofa,
    description: 'Complete interior solutions',
    color: 'from-luxury-gold to-luxury-bronze'
  }
];

export const ProductNavigationPopup: React.FC<ProductNavigationPopupProps> = ({
  isOpen,
  onClose,
  productName,
  onCategorySelect
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const isTouch = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const disableMotion = isTouch || prefersReducedMotion;

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

  const handleCategoryClick = useCallback((categoryId: string) => {
    setSelectedCategory(categoryId);
    setTimeout(() => {
      onCategorySelect(categoryId);
      onClose();
      setSelectedCategory(null);
    }, 300);
  }, [onCategorySelect, onClose]);

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  } as const;

  const popupVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 50
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: disableMotion ? undefined : {
        type: "spring" as const,
        damping: 25,
        stiffness: 300
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 50,
      transition: disableMotion ? { duration: 0.1 } : { duration: 0.2 }
    }
  } as const;

  const categoryVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: disableMotion ? undefined : {
        delay: i * 0.1,
        duration: 0.3,
        ease: "easeOut" as const
      }
    })
  } as const;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          {/* Backdrop */}
          <motion.div
            className={`absolute inset-0 bg-black/60 ${isTouch ? '' : 'backdrop-blur-sm'}`}
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Popup Content */}
          <motion.div
            className="relative w-full max-w-2xl bg-background text-foreground rounded-2xl shadow-2xl overflow-hidden border border-neutral-stone/40"
            variants={popupVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Header */}
            <div className="relative bg-gradient-to-r from-neutral-charcoal to-neutral-graphite p-6 text-white">
              <button
                type="button"
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/20 transition-colors"
                aria-label="Close popup"
              >
                <X size={20} />
              </button>
              
              <div className="pr-12">
                <h2 className="text-2xl font-bold mb-2 text-luxury-gold">Select Category</h2>
                <p className="text-white/80">
                  Choose the category for <span className="font-semibold text-white">{productName}</span>
                </p>
              </div>
            </div>

            {/* Categories Grid */}
            <div className="p-6">
              <div className="grid gap-4">
                {categories.map((category, index) => {
                  const Icon = category.icon;
                  const isSelected = selectedCategory === category.id;
                  
                  return (
                    <motion.button
                      key={category.id}
                      type="button"
                      custom={index}
                      variants={categoryVariants}
                      initial="hidden"
                      animate="visible"
                      onClick={() => handleCategoryClick(category.id)}
                      className={`
                        relative group p-4 rounded-xl border transition-all duration-300 text-left
                        ${isSelected 
                          ? 'border-luxury-gold bg-muted' 
                          : 'border-neutral-stone hover:border-neutral-slate hover:bg-muted'
                        }
                      `}
                      whileHover={disableMotion ? undefined : { scale: isSelected ? 1.05 : 1.02 }}
                      whileTap={disableMotion ? undefined : { scale: 0.98 }}
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`
                          p-3 rounded-lg bg-gradient-to-r ${category.color} text-white
                          ${isSelected ? 'shadow-lg' : 'group-hover:shadow-md'}
                          transition-shadow duration-300
                       `}>
                          <Icon size={24} />
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground mb-1">
                            {category.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {category.description}
                          </p>
                        </div>
                        
                        <ArrowRight 
                          size={20} 
                          className={`
                            text-muted-foreground transition-all duration-300
                            ${isSelected ? 'text-luxury-gold translate-x-1' : 'group-hover:text-foreground group-hover:translate-x-1'}
                          `}
                        />
                      </div>

                      {/* Selection indicator */}
                      {isSelected && (
                        <motion.div
                          className="absolute inset-0 border-2 border-blue-500 rounded-xl pointer-events-none"
                          initial={disableMotion ? undefined : { scale: 0.8, opacity: 0 }}
                          animate={disableMotion ? undefined : { scale: 1, opacity: 1 }}
                          transition={disableMotion ? undefined : { duration: 0.2 }}
                        />
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 pb-6">
              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <p className="text-sm text-muted-foreground">
                  Select a category to continue
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-neutral-graphite hover:text-foreground transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};