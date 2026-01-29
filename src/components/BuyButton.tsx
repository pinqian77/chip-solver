import { useState } from 'react';
import { useGame } from '../context/GameContext';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import BuyInModal from './BuyInModal';

export default function BuyButton({
  playerId,
  disabled,
  defaultAmount = 0,
}: {
  playerId: string;
  disabled?: boolean;
  defaultAmount?: number;
}) {
  const { dispatch } = useGame();
  const [open, setOpen] = useState(false);

  return (
    <>
      <motion.button
        aria-label="Buy in"
        whileTap={!disabled ? { scale: 0.94 } : undefined}
        disabled={disabled}
        onClick={() => {
          if (!disabled) setOpen(true);
        }}
        className={clsx(
          'btn-neon px-3 py-1 text-xs',
          disabled && 'cursor-not-allowed opacity-40',
        )}
      >
        buy-in
      </motion.button>

      <BuyInModal
        open={open}
        defaultAmount={defaultAmount}
        onConfirm={(amount) => {
          dispatch({ type: 'buyin', playerId, amount });
          setOpen(false);
        }}
        onCancel={() => setOpen(false)}
      />
    </>
  );
}
