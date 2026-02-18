import { useState, useRef, useEffect } from 'react';
import type { ReactNode } from 'react';

export interface SelectOption {
  value: string;
  label: string;
  icon?: ReactNode;
}

interface SelectProps {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
}

export function Select({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  label,
  error,
  disabled = false,
  className = '',
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optionValue: string) => {
    onChange?.(optionValue);
    setIsOpen(false);
  };

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-primary-700 mb-1.5">
          {label}
        </label>
      )}

      <div ref={selectRef} className="relative">
        {/* Select Button */}
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={`
            w-full px-3 py-2 rounded-lg
            bg-white
            border-2 ${error ? 'border-error-500' : 'border-primary-300'}
            text-gray-900
            text-left
            flex items-center justify-between gap-2
            transition-colors duration-150
            focus:outline-none focus:ring-2 focus:ring-primary-500/20
            disabled:opacity-50 disabled:cursor-not-allowed
            ${isOpen ? 'border-primary-500' : ''}
          `}
        >
          <span className="flex items-center gap-2">
            {selectedOption?.icon && <span className="w-4 h-4">{selectedOption.icon}</span>}
            <span className={selectedOption ? '' : 'text-primary-400'}>
              {selectedOption?.label || placeholder}
            </span>
          </span>
          
          <svg
            className={`w-5 h-5 text-primary-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Dropdown */}
        {isOpen && (
          <div
            className="
              absolute z-50 w-full mt-2
              bg-white
              border-2 border-primary-200
              rounded-lg shadow-lg
              max-h-60 overflow-y-auto
              animate-scale-in origin-top
            "
          >
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                className={`
                  w-full px-3 py-2
                  text-left flex items-center gap-2
                  transition-colors
                  ${
                    option.value === value
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-900 hover:bg-primary-50'
                  }
                `}
              >
                {option.icon && <span className="w-4 h-4">{option.icon}</span>}
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {error && (
        <p className="mt-1.5 text-xs text-error-600 dark:text-error-400">
          {error}
        </p>
      )}
    </div>
  );
}
