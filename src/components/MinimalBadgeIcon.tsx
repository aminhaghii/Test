import React from "react";

interface MinimalBadgeIconProps {
  content?: React.ReactNode; // حروف یا نماد داخلی
  bgColor?: string; // پس‌زمینه: #fff, #333, #d3d3d3 و...
  color?: string;   // رنگ محتوا: #000, #fff و ...
  size?: number;    // اندازه مربع
  className?: string;
}

export const MinimalBadgeIcon: React.FC<MinimalBadgeIconProps> = ({
  content,
  bgColor = "#fff",
  color = "#222",
  size = 48,
  className = ""
}) => {
  const isTextContent = typeof content === 'string';
  
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      style={{ display: "inline-block" }}
    >
      {/* قاب مربع با لبه پایین پرچمی */}
      <rect
        x="2"
        y="2"
        width={size - 4}
        height={size - 10}
        rx={4}
        fill={bgColor}
        stroke={color}
        strokeWidth="1.5"
      />
      {/* لبه‌ی پایین به شکل پرچم/شیلد */}
      <polygon
        points={`${size * 0.25},${size - 10} ${size * 0.5},${size - 2} ${size * 0.75},${size - 10}`}
        fill={bgColor}
        stroke={color}
        strokeWidth="1.5"
      />
      
      {/* محتوای icon */}
      {isTextContent ? (
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          fill={color}
          fontSize={size * 0.3}
          fontFamily="sans-serif"
          fontWeight="500"
          dominantBaseline="middle"
        >
          {content}
        </text>
      ) : content ? (
        <g transform={`translate(${size / 2}, ${size / 2})`} fill={color} stroke={color}>
          {content}
        </g>
      ) : null}
    </svg>
  );
};

export default MinimalBadgeIcon;

