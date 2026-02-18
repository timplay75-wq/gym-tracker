import { forwardRef } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';

type InputVariant = 'default' | 'error' | 'success';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: string;
  variant?: InputVariant;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      success,
      variant = 'default',
      icon,
      iconPosition = 'left',
      className = '',
      type = 'text',
      ...props
    },
    ref
  ) => {
    // Variant styles
    const variantClasses = {
      default: 'border-[#9333ea] focus:border-[#7c3aed]',
      error: 'border-error-500 focus:border-error-600',
      success: 'border-success-500 focus:border-success-600',
    };

    const currentVariant = error ? 'error' : success ? 'success' : variant;

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-primary-700 mb-1.5">
            {label}
          </label>
        )}

        <div className="relative">
          {/* Left icon */}
          {icon && iconPosition === 'left' && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7c3aed]">
              {icon}
            </div>
          )}

          <input
            ref={ref}
            type={type}
            className={`
              w-full px-4 py-3 rounded-xl
              bg-white
              border-2 ${variantClasses[currentVariant]}
              text-gray-900
              placeholder-[#9333ea]
              focus:outline-none focus:ring-4 focus:ring-[#9333ea]/20
              transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed
              ${icon && iconPosition === 'left' ? 'pl-10' : ''}
              ${icon && iconPosition === 'right' ? 'pr-10' : ''}
              ${className}
            `}
            {...props}
          />

          {/* Right icon */}
          {icon && iconPosition === 'right' && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7c3aed]">
              {icon}
            </div>
          )}
        </div>

        {/* Error message */}
        {error && (
          <p className="mt-1.5 text-sm text-error-600 flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </p>
        )}

        {/* Success message */}
        {success && (
          <p className="mt-1.5 text-sm text-success-600 flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            {success}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
