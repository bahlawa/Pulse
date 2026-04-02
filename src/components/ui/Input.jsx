import { forwardRef } from 'react';

export const Input = forwardRef(({ 
  label, 
  error, 
  className = '', 
  id, 
  ...props 
}, ref) => {
  const inputId = id || Math.random().toString(36).substr(2, 9);
  
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-text-secondary">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        className={`bg-bg-base border border-border/50 rounded-2xl h-12 px-5 py-2 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent focus:bg-bg-surface focus:ring-1 focus:ring-accent transition-all duration-300 ${
          error ? 'border-danger focus:border-danger focus:ring-danger' : ''
        }`}
        {...props}
      />
      {error && (
        <span className="text-xs text-danger font-medium mt-1">
          {error}
        </span>
      )}
    </div>
  );
});

Input.displayName = 'Input';
