import { Fragment } from 'react';
import { X } from 'lucide-react';
import Button from './Button';

const Dialog = ({
  open,
  onClose,
  title,
  description,
  children,
  size = 'md',
}) => {
  if (!open) return null;

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-4xl',
  };

  return (
    <Fragment>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-fade-in"
        onClick={onClose}
      />
      
      {/* Dialog */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div 
          className={`
            w-full ${sizes[size]} bg-[var(--bg-card)] rounded-2xl shadow-2xl
            border border-[var(--border-color)] animate-fade-in
          `}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between p-6 border-b border-[var(--border-color)]">
            <div>
              <h2 className="text-xl font-semibold" style={{ fontFamily: 'Space Grotesk' }}>
                {title}
              </h2>
              {description && (
                <p className="text-[var(--text-secondary)] mt-1">{description}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors -mr-2 -mt-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </Fragment>
  );
};

// Confirmation Dialog
export const ConfirmDialog = ({
  isOpen,
  open,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant,
  variant = 'danger',
  loading = false,
  disabled = false,
}) => {
  const isDialogOpen = isOpen ?? open;
  const dialogMessage = message ?? description ?? 'Are you sure you want to proceed?';
  const buttonVariant = confirmVariant ?? variant;
  const isDisabled = disabled || loading;

  return (
    <Dialog open={isDialogOpen} onClose={onClose} title={title} description={dialogMessage} size="sm">
      <div className="flex gap-3 justify-end">
        <Button variant="secondary" onClick={onClose} disabled={isDisabled}>
          {cancelText}
        </Button>
        <Button variant={buttonVariant} onClick={onConfirm} loading={loading} disabled={isDisabled}>
          {confirmText}
        </Button>
      </div>
    </Dialog>
  );
};

export default Dialog;

