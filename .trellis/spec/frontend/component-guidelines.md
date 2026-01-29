# Component Guidelines

> How components are built in this project.

---

## Overview

Components use `export default function` syntax, Tailwind CSS for styling, Framer Motion for animation, and `clsx` for conditional class names. Props are typed inline or with a named `interface Props` in the same file.

---

## Component Structure

Standard structure of a component file:

```tsx
// 1. Imports (React, hooks, libraries, sibling components, types)
import { useGame } from '../context/GameContext';
import { motion } from 'framer-motion';
import clsx from 'clsx';

// 2. Default export function component with inline or named props
export default function BuyButton({
  playerId,
  disabled,
}: {
  playerId: string;
  disabled?: boolean;
}) {
  // 3. Hooks at the top
  const { dispatch } = useGame();

  // 4. JSX return
  return (
    <motion.button
      whileTap={!disabled ? { scale: 0.94 } : undefined}
      disabled={disabled}
      onClick={() => { /* handler */ }}
      className={clsx(
        'btn-neon px-3 py-1 text-xs',
        disabled && 'cursor-not-allowed opacity-40',
      )}
    >
      buy-in
    </motion.button>
  );
}
```

Reference: `src/components/BuyButton.tsx`

---

## Props Conventions

**Two patterns are used:**

### 1. Inline object type (for simple components)

Used when the component has few, straightforward props.

```tsx
// src/components/NeonButton.tsx
export default function NeonButton({
  label,
  onClick,
  icon,
}: {
  label: string;
  onClick?: () => void;
  icon?: React.ReactNode;
}) {
```

### 2. Named `interface Props` (for complex components)

Used when the component has many props or the types are complex.

```tsx
// src/components/PlayerTable.tsx
interface Props {
  phase: 'play' | 'settle' | 'done';
  cash: Record<string, string>;
  setCash: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  onEdit: () => void;
}

export default function PlayerTable({ phase, cash, setCash, onEdit }: Props) {
```

**Rules:**
- Always destructure props in the function signature
- Use `interface Props` when there are 4+ props or complex types
- Use inline types for 1-3 simple props
- Props interface is always named `Props` (not `PlayerTableProps`)

---

## Export Convention

- **Components and pages:** `export default function ComponentName`
- **Context:** Named exports (`export const GameProvider`, `export function useGame`)
- **Utilities and algorithms:** Named exports (`export function settle`)

---

## Styling Patterns

### Tailwind CSS + custom classes

Global reusable classes are defined in `src/index.css` using `@apply`:

| Class | Purpose |
|-------|---------|
| `.card` | Dark card container with neon border |
| `.btn-neon` | Neon-styled button |
| `.table-head` | Table header row styling |
| `.input-name` | Player name text input |
| `.input-chip` | Chip count number input |
| `.chip-animated` | Flowing neon gradient border animation |

Use these classes instead of repeating long Tailwind chains.

### Conditional classes with `clsx`

Always use `clsx` for conditional class composition:

```tsx
className={clsx(
  'btn-neon px-6',
  phase !== 'play' && 'cursor-not-allowed opacity-40',
)}
```

Reference: `src/components/PlayerTable.tsx:46-49`

### Theme colors

Custom Tailwind colors defined in `tailwind.config.js`:

| Token | Hex | Usage |
|-------|-----|-------|
| `neonCyan` | `#00F9FF` | Primary accent, borders, glows |
| `neonPink` | `#FF007A` | Secondary accent, headings, delete actions |
| `bgNight` | `#0d0d13` | Darkest background |
| `bgDark` | `#15151e` | Card/section background |

### Framer Motion

Used for:
- `whileTap={{ scale: 0.94 }}` on buttons
- `motion.div layout` for layout animations
- `AnimatePresence` + `initial/animate/exit` for enter/exit transitions

Reference: `src/pages/HomePage.tsx:151-188` (result panel animation)

---

## Accessibility

No formal accessibility standards are currently enforced. Areas to be aware of:

- Buttons use native `<button>` elements (good)
- `disabled` attribute is used for phase-gated actions
- No `aria-*` attributes are currently used
- Color contrast on dark background with neon colors should be verified

---

## Common Mistakes

1. **Forgetting to gate actions by phase** -- Most interactive elements should be disabled outside the `'play'` phase. Always check `phase` before dispatching actions.

2. **Using raw Tailwind instead of custom classes** -- Use `.btn-neon`, `.card`, `.input-chip` etc. for consistency. Don't recreate those styles inline.

3. **Not using `clsx` for conditional classes** -- Don't use template literals for conditional Tailwind classes; use `clsx` instead.

4. **Missing `disabled` prop forwarding** -- When a component wraps an interactive element, always accept and forward a `disabled` prop.
