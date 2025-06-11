import { useGame } from '../context/GameContext';
import { motion } from 'framer-motion';
import clsx from 'clsx';

export default function BuyButton({
  playerId,
  disabled,
}: {
  playerId: string;
  disabled?: boolean;
}) {
  const { dispatch } = useGame();

  return (
    <motion.button
      whileTap={!disabled ? { scale: 0.94 } : undefined}
      disabled={disabled}
      onClick={() => {
        if (disabled) return;
        const amt = parseInt(prompt('Buy-in amount?') || '', 10);
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