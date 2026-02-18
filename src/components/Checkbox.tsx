import type { InputHTMLAttributes } from 'react';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
}

export function Checkbox({ label, error, className = '', ...props }: CheckboxProps) {
  return (
    <div className={className}>
      <label className="inline-flex items-center gap-2 cursor-pointer group">
        <div className="relative">
          <input
            type="checkbox"
            className="
              peer sr-only
            "
            {...props}
          />
          <div className="
            w-5 h-5 rounded border-2 
            border-gray-300 dark:border-gray-600
            bg-white dark:bg-gray-800
            transition-all duration-150
            peer-checked:bg-primary-600 peer-checked:border-primary-600
            peer-checked:dark:bg-primary-500 peer-checked:dark:border-primary-500
            peer-focus:ring-2 peer-focus:ring-primary-500/30
            peer-disabled:opacity-50 peer-disabled:cursor-not-allowed
            group-hover:border-primary-400 dark:group-hover:border-primary-500
          ">
            <svg
              className="
                absolute inset-0 w-full h-full p-0.5
                text-white opacity-0 
                peer-checked:opacity-100 
                transition-opacity duration-150
              "
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        
        {label && (
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 select-none">
            {label}
          </span>
        )}
      </label>
      
      {error && (
        <p className="mt-1 text-xs text-error-600 dark:text-error-400">
          {error}
        </p>
      )}
    </div>
  );
}
