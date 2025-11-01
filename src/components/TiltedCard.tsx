import { useRef, useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

const springValues = {
  damping: 40,  // Further increased for faster damping (reduces GPU work)
  stiffness: 60, // Further reduced for smoother, less intensive animations
  mass: 2.0      // Further increased for smoother motion
};

interface TiltedCardProps {
  imageSrc: string;
  altText?: string;
  captionText?: string;
  containerHeight?: string;
  containerWidth?: string;
  imageHeight?: string;
  imageWidth?: string;
  scaleOnHover?: number;
  rotateAmplitude?: number;
  showMobileWarning?: boolean;
  showTooltip?: boolean;
  overlayContent?: React.ReactNode;
  displayOverlayContent?: boolean;
  children?: React.ReactNode;
}

export default function TiltedCard({
  imageSrc,
  altText = 'Tilted card image',
  captionText = '',
  containerHeight = '300px',
  containerWidth = '100%',
  imageHeight = '300px',
  imageWidth = '300px',
  scaleOnHover = 1.15,
  rotateAmplitude = 14,
  showMobileWarning = false,
  showTooltip = true,
  overlayContent = null,
  displayOverlayContent = false,
  children
}: TiltedCardProps) {
  const ref = useRef<HTMLElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useMotionValue(0), springValues);
  const rotateY = useSpring(useMotionValue(0), springValues);
  const scale = useSpring(1, springValues);
  const opacity = useSpring(0, {
    damping: 20,
    stiffness: 120,
    mass: 1
  });
  const rotateFigcaption = useSpring(0, {
    stiffness: 350,
    damping: 30,
    mass: 1
  });

  const [lastX, setLastX] = useState(0);
  const [lastY, setLastY] = useState(0);
  const [isThrottled, setIsThrottled] = useState(false);

  function handleMouse(event: React.MouseEvent<HTMLElement>) {
    // Throttle mouse events to improve performance - increased from 16ms to 32ms (30fps)
    if (isThrottled) return;
    
    setIsThrottled(true);
    setTimeout(() => setIsThrottled(false), 32); // ~30fps for better GPU performance

    const { offsetX, offsetY } = event.nativeEvent;
    const { offsetWidth, offsetHeight } = event.currentTarget;

    const rotateXValue = ((offsetY - offsetHeight / 2) / offsetHeight) * rotateAmplitude;
    const rotateYValue = ((offsetX - offsetWidth / 2) / offsetWidth) * -rotateAmplitude;

    rotateX.set(rotateXValue);
    rotateY.set(rotateYValue);

    const rotateFigcaptionValue = ((offsetX - offsetWidth / 2) / offsetWidth) * 10;
    rotateFigcaption.set(rotateFigcaptionValue);

    x.set(offsetX);
    y.set(offsetY);

    setLastX(offsetX);
    setLastY(offsetY);
  }

  function handleMouseEnter() {
    scale.set(scaleOnHover);
    opacity.set(1);
  }

  function handleMouseLeave() {
    opacity.set(0);
    scale.set(1);
    rotateX.set(0);
    rotateY.set(0);
    rotateFigcaption.set(0);
    x.set(0);
    y.set(0);
  }

  return (
    <figure
      ref={ref}
      className="relative w-full h-full [perspective:800px] flex flex-col items-center justify-center"
      style={{
        height: containerHeight,
        width: containerWidth
      }}
      onMouseMove={handleMouse}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {showMobileWarning && (
        <div className="absolute top-4 text-center text-sm block sm:hidden">
          This effect is not optimized for mobile. Check on desktop.
        </div>
      )}

      <motion.div
        className="relative [transform-style:preserve-3d]"
        style={{
          width: imageWidth,
          height: imageHeight,
          rotateX,
          rotateY,
          scale
        }}
      >
        <motion.img
          src={imageSrc}
          alt={altText}
          loading="lazy"
          className="absolute top-0 left-0 object-cover rounded-[15px]"
          style={{
            width: imageWidth,
            height: imageHeight,
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)' // Replaced filter with boxShadow (GPU friendly)
          }}
        />

        {displayOverlayContent && overlayContent && (
          <motion.div 
            className="absolute top-0 left-0 z-[2] rounded-[15px] overflow-hidden pointer-events-none"
            style={{ 
              opacity,
              width: imageWidth,
              height: imageHeight,
              transform: 'translateZ(30px)'
            }}
          >
            {overlayContent}
          </motion.div>
        )}

        {children && (
          <motion.div className="absolute inset-0 z-[1]" style={{ transform: 'translateZ(20px)' }}>
            {children}
          </motion.div>
        )}
      </motion.div>

      {showTooltip && captionText && (
        <motion.figcaption
          className="pointer-events-none absolute left-0 top-0 rounded-[4px] bg-white px-[10px] py-[4px] text-[10px] text-[#2d2d2d] opacity-0 z-[3] hidden sm:block"
          style={{
            x,
            y,
            opacity,
            rotate: rotateFigcaption
          }}
        >
          {captionText}
        </motion.figcaption>
      )}
    </figure>
  );
}