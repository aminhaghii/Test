import React from 'react';

const ProductLoadingSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex justify-center">
          <div className="relative w-full">
            {/* Shimmer effect container */}
            <div className="relative h-[420px] rounded-[15px] bg-stone-200 overflow-hidden">
              {/* Shimmer animation */}
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              
              {/* Content skeleton */}
              <div className="absolute inset-0 flex flex-col">
                {/* Badge skeleton */}
                <div className="absolute top-3 left-3 w-16 h-6 bg-stone-300/50 rounded-full" />
                
                {/* Bottom overlay skeleton */}
                <div className="mt-auto bg-gradient-to-t from-black/60 to-transparent p-4">
                  <div className="h-6 bg-white/20 rounded mb-2 w-3/4" />
                  <div className="h-4 bg-white/20 rounded mb-2 w-1/2" />
                  <div className="h-5 bg-white/20 rounded w-1/3" />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductLoadingSkeleton;

