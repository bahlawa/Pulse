import { motion } from 'framer-motion';

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  fullWidth = false,
  ...props 
}) {
  const baseStyles = "inline-flex items-center justify-center rounded-full font-bold tracking-wide transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-bg-base disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-accent text-bg-base hover:bg-accent-dim shadow-[0_4px_14px_0_rgba(168,85,247,0.39)] hover:shadow-[0_6px_20px_rgba(168,85,247,0.23)] hover:-translate-y-[1px]",
    secondary: "bg-bg-surface text-text-primary border border-border hover:border-text-muted hover:bg-bg-card",
    danger: "bg-danger text-white hover:opacity-90",
    ghost: "text-text-secondary hover:text-text-primary hover:bg-bg-surface"
  };
  
  const sizes = {
    sm: "h-9 px-4 text-xs",
    md: "h-12 px-6 text-sm",
    lg: "h-14 px-8 text-base"
  };

  const widthStyle = fullWidth ? "w-full" : "";

  return (
    <motion.button 
      whileTap={{ scale: 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthStyle} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}
