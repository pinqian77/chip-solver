import { motion } from 'framer-motion';

export default function NeonButton({
  label,
  onClick,
  icon,
  ariaLabel,
}: {
  label: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  ariaLabel?: string;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.94 }}
      className="btn-neon"
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {icon}
      {label}
    </motion.button>
  );
}