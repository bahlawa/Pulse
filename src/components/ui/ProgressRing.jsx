import { motion } from 'framer-motion';

export function ProgressRing({ 
  value, 
  max, 
  size = 120, 
  strokeWidth = 12, 
  color = 'var(--accent)',
  bgStroke = 'var(--border)',
  children
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const safeValue = Math.min(Math.max(value, 0), max) || 0;
  const offset = circumference - (safeValue / max) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center font-heading" style={{ width: size, height: size }}>
      <svg
        className="transform -rotate-90 origin-center absolute inset-0"
        width={size}
        height={size}
      >
        <circle
          className="transition-colors"
          stroke={bgStroke}
          fill="transparent"
          strokeWidth={strokeWidth}
          r={radius}
          cx={size / 2}
          cy={size / 2}
          strokeLinecap="round"
        />
        <motion.circle
          className="drop-shadow-sm"
          stroke={color}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          r={radius}
          cx={size / 2}
          cy={size / 2}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        {children || (
          <>
            <span className="text-2xl font-bold text-text-primary tracking-tight">{Math.round(safeValue)}</span>
            <span className="text-xs text-text-secondary uppercase tracking-widest mt-1">/ {max}</span>
          </>
        )}
      </div>
    </div>
  );
}
