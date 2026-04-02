import { motion } from 'framer-motion';

export function Card({ children, className = '', animate = false, index = 0, ...props }) {
  const Component = animate ? motion.div : 'div';
  
  const motionProps = animate ? {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { 
      duration: 0.4, 
      ease: "easeOut",
      delay: index * 0.05 
    }
  } : {};

  return (
    <Component 
      className={`glass-card rounded-[32px] p-6 sm:p-8 relative ${className}`}
      {...motionProps}
      {...props}
    >
      {/* Subtle highlight edge */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none" />
      {/* Subtle radial glow inside card */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-accent/5 rounded-full blur-[50px] pointer-events-none" />
      <div className="relative z-10">
        {children}
      </div>
    </Component>
  );
}
