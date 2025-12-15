import { forwardRef } from 'react';

const Textarea = forwardRef(({
  label,
  error,
  className = '',
  wrapperClassName = '',
  rows = 4,
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
      <textarea
        ref={ref}
        rows={rows}
        className={`
          w-full px-4 py-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)]
          focus:border-[var(--accent-primary)] transition-colors resize-none
          disabled:opacity-50 disabled:cursor-not-allowed
          ${error ? 'border-[var(--error)]' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1.5 text-sm text-[var(--error)]">{error}</p>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';

export default Textarea;

