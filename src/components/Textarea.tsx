import { forwardRef } from 'react';
import type { TextareaHTMLAttributes } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  success?: string;
  helperText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, success, helperText, className = '', ...props }, ref) => {
    const borderColor = error
      ? 'border-error-500 focus:border-error-600'
      : success
      ? 'border-success-500 focus:border-success-600'
      : 'border-primary-300 focus:border-primary-500';

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-primary-700 mb-1.5">
            {label}
          </label>
        )}

        <textarea
          ref={ref}
          className={`
            w-full px-3 py-2 rounded-lg
            bg-white
            border-2 ${borderColor}
            text-gray-900
            placeholder-primary-400
            resize-none
            transition-colors duration-150
            focus:outline-none focus:ring-2 focus:ring-primary-500/20
            disabled:opacity-50 disabled:cursor-not-allowed
            ${className}
          `}
          {...props}
        />

        {/* Helper/Error/Success text */}
        {(error || success || helperText) && (
          <p
            className={`mt-1.5 text-xs ${
              error
                ? 'text-error-600'
                : success
                ? 'text-success-600'
                : 'text-primary-500'
            }`}
          >
            {error || success || helperText}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
