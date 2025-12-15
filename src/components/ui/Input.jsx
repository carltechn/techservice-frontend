import { forwardRef } from 'react';

const Input = forwardRef(({
  label,
  error,
  icon: Icon,
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
        {Icon && (
          <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
        )}
        <input
          ref={ref}
          className={`
            w-full py-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)]
            focus:border-[var(--accent-primary)] transition-colors
            disabled:opacity-50 disabled:cursor-not-allowed
            ${Icon ? 'pl-12 pr-4' : 'px-4'}
            ${error ? 'border-[var(--error)]' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1.5 text-sm text-[var(--error)]">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;

