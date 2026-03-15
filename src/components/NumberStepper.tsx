interface NumberStepperProps {
  value: number | string;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  /** 'lg' = ActiveWorkout big inputs, 'md' = SetupExercise, 'sm' = inline compact */
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  /** Allow string-based onChange for ActiveWorkout weight/reps */
  onChangeRaw?: (value: string) => void;
}

export const NumberStepper = ({
  value,
  onChange,
  min = 0,
  max = 9999,
  step = 1,
  placeholder = '0',
  size = 'md',
  className = '',
  onChangeRaw,
}: NumberStepperProps) => {
  const numValue = typeof value === 'string' ? parseFloat(value) || 0 : value;

  const increment = () => {
    const next = Math.min(numValue + step, max);
    if (onChangeRaw) onChangeRaw(String(next));
    else onChange(next);
  };

  const decrement = () => {
    const next = Math.max(numValue - step, min);
    if (onChangeRaw) onChangeRaw(String(next));
    else onChange(next);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChangeRaw) {
      onChangeRaw(e.target.value);
    } else {
      onChange(Number(e.target.value) || 0);
    }
  };

  if (size === 'lg') {
    return (
      <div className={`flex items-center gap-2 overflow-hidden ${className}`}>
        <button
          type="button"
          onClick={decrement}
          className="flex-shrink-0 w-14 h-14 rounded-xl bg-[#f3e8ff] dark:bg-purple-900/30 text-[#7c3aed] text-2xl font-bold flex items-center justify-center active:bg-[#e9d5ff] dark:active:bg-purple-900/50 transition-colors select-none"
        >
          −
        </button>
        <input
          type="number"
          value={value}
          onChange={handleInput}
          onFocus={(e) => { if (e.target.value === '0') onChangeRaw?.(''); }}
          onBlur={(e) => { if (e.target.value === '' || e.target.value === '-') onChangeRaw?.('0'); }}
          className="min-w-0 flex-1 h-16 text-center text-3xl font-bold bg-white dark:bg-[#16213e] border-2 border-[#9333ea] rounded-xl text-gray-900 dark:text-white focus:border-[#7c3aed] focus:outline-none transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          step={step}
          min={min}
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={increment}
          className="flex-shrink-0 w-14 h-14 rounded-xl bg-[#f3e8ff] dark:bg-purple-900/30 text-[#7c3aed] text-2xl font-bold flex items-center justify-center active:bg-[#e9d5ff] dark:active:bg-purple-900/50 transition-colors select-none"
        >
          +
        </button>
      </div>
    );
  }

  if (size === 'md') {
    return (
      <div className={`flex items-center gap-1.5 overflow-hidden ${className}`}>
        <button
          type="button"
          onClick={decrement}
          className="flex-shrink-0 w-10 h-10 rounded-lg bg-[#f3e8ff] dark:bg-purple-900/30 text-[#7c3aed] text-lg font-bold flex items-center justify-center active:bg-[#e9d5ff] dark:active:bg-purple-900/50 transition-colors select-none"
        >
          −
        </button>
        <input
          type="number"
          value={value || ''}
          onChange={handleInput}
          className="min-w-0 flex-1 px-1 py-2 text-center text-lg font-semibold bg-white dark:bg-[#16213e] border-2 border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:border-[#9333ea] focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          min={min}
          step={step}
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={increment}
          className="flex-shrink-0 w-10 h-10 rounded-lg bg-[#f3e8ff] dark:bg-purple-900/30 text-[#7c3aed] text-lg font-bold flex items-center justify-center active:bg-[#e9d5ff] dark:active:bg-purple-900/50 transition-colors select-none"
        >
          +
        </button>
      </div>
    );
  }

  // size === 'sm'
  return (
    <div className={`flex items-center gap-0.5 overflow-hidden ${className}`}>
      <button
        type="button"
        onClick={decrement}
        className="flex-shrink-0 w-7 h-7 rounded-md bg-[#f3e8ff] dark:bg-purple-900/30 text-[#7c3aed] text-sm font-bold flex items-center justify-center active:bg-[#e9d5ff] dark:active:bg-purple-900/50 transition-colors select-none"
      >
        −
      </button>
      <input
        type="number"
        value={value || ''}
        onChange={handleInput}
        className="min-w-0 flex-1 px-0.5 py-1 text-center text-sm font-medium bg-white dark:bg-[#16213e] border border-[#e5e7eb] dark:border-gray-600 rounded text-gray-900 dark:text-white focus:border-[#9333ea] focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        min={min}
        step={step}
        placeholder={placeholder}
      />
      <button
        type="button"
        onClick={increment}
        className="flex-shrink-0 w-7 h-7 rounded-md bg-[#f3e8ff] dark:bg-purple-900/30 text-[#7c3aed] text-sm font-bold flex items-center justify-center active:bg-[#e9d5ff] dark:active:bg-purple-900/50 transition-colors select-none"
      >
        +
      </button>
    </div>
  );
};
