import { motion } from 'framer-motion';

export default function NeonButton({
  label,
  onClick,
  icon,
}: {
  label: string;
  onClick?: () => void;
  icon?: React.ReactNode;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.94 }}
      className="btn-neon"
      onClick={onClick}
    >
      {icon}
      {label}
    </motion.button>
  );
}