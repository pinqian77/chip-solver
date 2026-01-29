import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function BuyInModal({
  open,
  defaultAmount = 0,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  defaultAmount?: number;
  onConfirm: (amount: number) => void;
  onCancel: () => void;
}) {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  /* reset & focus when opening */
  useEffect(() => {
    if (open) {
      setValue(defaultAmount > 0 ? String(defaultAmount) : '');
      // small delay so the DOM is painted before focusing
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open, defaultAmount]);

  const confirm = () => {
    const amt = parseInt(value, 10);
    if (Number.isFinite(amt) && amt > 0) onConfirm(amt);
  };

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          key="buyin-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={onCancel}
        >
          <motion.div
            key="buyin-dialog"
            initial={{ opacity: 0, scale: 0.9, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 12 }}
            transition={{ duration: 0.2 }}
            className="card mx-4 w-full max-w-xs p-6 flex flex-col gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-orbitron text-sm text-neonPink uppercase tracking-wider">
              Buy-in Amount
            </h3>

            <input
              ref={inputRef}
              type="number"
              min={1}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') confirm();
                if (e.key === 'Escape') onCancel();
              }}
              placeholder="Enter amount"
              className="input-chip"
            />

            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={onCancel}
                className="btn-neon px-4 py-1 text-xs opacity-60 hover:opacity-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirm}
                className="btn-neon px-4 py-1 text-xs"
              >
                Confirm
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
