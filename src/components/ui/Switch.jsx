import { forwardRef } from 'react';

const Switch = forwardRef(({
  label,
  description,
  checked = false,
  onChange,
  disabled = false,
  className = '',
  ...props
}, ref) => {
  return (
    <label className={`flex items-start gap-3 cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}>
      <div className="relative mt-0.5">
        <input
          ref={ref}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="sr-only peer"
          {...props}
        />
        <div className={`
          w-11 h-6 rounded-full transition-colors
          ${checked ? 'bg-[var(--accent-primary)]' : 'bg-[var(--bg-tertiary)]'}
        `} />
        <div className={`
          absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm
          transition-transform duration-200
          ${checked ? 'translate-x-5' : 'translate-x-0'}
        `} />
      </div>
      {(label || description) && (
        <div className="flex-1">
          {label && <p className="font-medium">{label}</p>}
          {description && <p className="text-sm text-[var(--text-secondary)]">{description}</p>}
        </div>
      )}
    </label>
  );
});

Switch.displayName = 'Switch';

export default Switch;

