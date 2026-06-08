import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle, Info, ShoppingBag } from 'lucide-react';

const typeConfig = {
  success: { icon: CheckCircle, iconBg: 'bg-green-100', iconColor: 'text-green-600', btnClass: 'bg-green-600 hover:bg-green-700 text-white' },
  error:   { icon: XCircle,     iconBg: 'bg-red-100',   iconColor: 'text-red-600',   btnClass: 'bg-red-600 hover:bg-red-700 text-white' },
  warning: { icon: AlertTriangle,iconBg: 'bg-amber-100', iconColor: 'text-amber-500', btnClass: 'bg-amber-500 hover:bg-amber-600 text-white' },
  info:    { icon: Info,         iconBg: 'bg-blue-100',  iconColor: 'text-blue-600',  btnClass: 'bg-blue-600 hover:bg-blue-700 text-white' },
  confirm: { icon: AlertTriangle,iconBg: 'bg-amber-100', iconColor: 'text-amber-500', btnClass: 'bg-black hover:bg-gray-800 text-white' },
  order:   { icon: ShoppingBag,  iconBg: 'bg-green-100', iconColor: 'text-green-600', btnClass: 'bg-black hover:bg-gray-800 text-white' },
};

const Dialog = ({
  isOpen,
  type = 'info',
  title,
  message,
  confirmLabel = 'OK',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  children,
  confirmDisabled = false,
}) => {
  const cfg = typeConfig[type] || typeConfig.info;
  const Icon = cfg.icon;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onCancel || onConfirm}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 z-10"
          >
            {/* Icon + heading */}
            <div className="text-center mb-5">
              <div className={`w-14 h-14 ${cfg.iconBg} rounded-full flex items-center justify-center mx-auto mb-3`}>
                <Icon size={28} className={cfg.iconColor} />
              </div>
              {title && <h3 className="text-xl font-bold mb-1">{title}</h3>}
              {message && <p className="text-gray-500 text-sm leading-relaxed">{message}</p>}
            </div>

            {/* Custom content slot */}
            {children && <div className="mb-5">{children}</div>}

            {/* Action buttons */}
            <div className="flex gap-3">
              {onCancel && (
                <button
                  onClick={onCancel}
                  className="flex-1 px-5 py-3 border-2 border-gray-200 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-colors"
                >
                  {cancelLabel}
                </button>
              )}
              <button
                onClick={onConfirm}
                disabled={confirmDisabled}
                className={`flex-1 px-5 py-3 rounded-xl font-semibold text-sm transition-colors ${cfg.btnClass} disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Dialog;
