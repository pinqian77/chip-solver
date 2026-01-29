import { useGame } from '../context/GameContext';
import { motion } from 'framer-motion';
import clsx from 'clsx';

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

  return (
    <motion.button
      whileTap={!disabled ? { scale: 0.94 } : undefined}
      disabled={disabled}
      onClick={() => {
        if (disabled) return;
        const prefill = defaultAmount > 0 ? String(defaultAmount) : '';
        const amt = parseInt(prompt('Buy-in amount?', prefill) || '', 10);
        if (Number.isFinite(amt) && amt > 0)
          dispatch({ type: 'buyin', playerId, amount: amt });
      }}
      className={clsx(
        'btn-neon px-3 py-1 text-xs',
        disabled && 'cursor-not-allowed opacity-40',
      )}
    >
      buy-in
    </motion.button>
  );
}