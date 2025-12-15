import { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

const Select = forwardRef(({
  label,
  error,
  options = [],
  placeholder = 'Select an option',
  className = '',
  wrapperClassName = '',
  ...props
}, ref) => {
  return (
    <div className={wrapperClassName}>
      {label && (
        <label className="block text-sm font-medium mb-2">
          {label}
          {props.required && <span className="text-[var(--error)] ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          className={`
            w-full px-4 py-3 pr-10 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)]
            focus:border-[var(--accent-primary)] transition-colors appearance-none
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? 'border-[var(--error)]' : ''}
            ${className}
          `}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)] pointer-events-none" />
      </div>
      {error && (
        <p className="mt-1.5 text-sm text-[var(--error)]">{error}</p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;

