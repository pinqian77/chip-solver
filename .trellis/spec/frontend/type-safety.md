# Type Safety

> Type safety patterns in this project.

---

## Overview

The project uses **TypeScript** with strict configuration (via `tsconfig.app.json`). Domain types are centralized in `src/types/`. No runtime validation library is used -- validation is done manually.

---

## Type Organization

### Shared domain types: `src/types/poker.ts`

All domain-level types live in a single file:

```tsx
export type EventType = 'buyin';

export interface Player {
  id: string;
  name: string;
}

export interface Event {
  id: string;
  playerId: string;
  amount: number;
  type: EventType;
  createdAt: number;
}

export interface CashoutInput {
  playerId: string;
  value: number;
}
```

### Local types: defined in the file that uses them

Component props and reducer types are defined in the same file:

```tsx
// src/context/GameContext.tsx
interface State {
  players: Player[];
  events: Event[];
}

type Action =
  | { type: 'addPlayer'; name: string }
  | { type: 'removePlayer'; id: string }
  | { type: 'buyin'; playerId: string; amount: number }
  | { type: 'removeEvent'; eventId: string };
```

```tsx
// src/components/PlayerTable.tsx
interface Props {
  phase: 'play' | 'settle' | 'done';
  cash: Record<string, string>;
  setCash: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  onEdit: () => void;
}
```

### Rules

- **Domain types** (Player, Event, etc.) go in `src/types/`
- **Component props** are defined in the component file
- **Reducer state/actions** are defined in the context file
- Use `import type` for type-only imports: `import type { Player, Event } from '../types/poker'`

---

## Validation

No runtime validation library (Zod, Yup, etc.) is used. Validation is manual:

```tsx
// src/pages/HomePage.tsx:51-61
const validate = () => {
  if (totalBuy !== totalCash) {
    setError(`Total buy-in ${totalBuy} ≠ chips ${totalCash} (diff ${totalBuy - totalCash})`);
    setValidateOK(false);
  } else {
    setError(null);
    setValidateOK(true);
  }
};
```

```tsx
// src/algorithms/settle.ts:21
if (sum !== 0) throw new Error('Buy-in does not match cashout total.');
```

Input parsing uses `Number()` or `parseInt()` with guards:

```tsx
// src/components/BuyButton.tsx:19-21
const amt = parseInt(prompt('Buy-in amount?') || '', 10);
if (Number.isFinite(amt) && amt > 0)
  dispatch({ type: 'buyin', playerId, amount: amt });
```

---

## Common Patterns

### Discriminated union for actions

```tsx
type Action =
  | { type: 'addPlayer'; name: string }
  | { type: 'removePlayer'; id: string }
  | { type: 'buyin'; playerId: string; amount: number }
  | { type: 'removeEvent'; eventId: string };
```

### `Record<string, T>` for ID-keyed maps

```tsx
const cash: Record<string, string>        // playerId -> input string
const net: Record<string, number>          // playerId -> net profit/loss
const matrix: Record<string, Record<string, number>>  // from -> to -> amount
```

### `ReturnType<typeof fn>` for inferred return types

```tsx
// src/pages/HomePage.tsx:18
const [result, setResult] = useState<ReturnType<typeof settle> | null>(null);
```

### String literal union types for phases

```tsx
phase: 'play' | 'settle' | 'done'
```

This is used as a prop type and repeated across components. It is not extracted to a shared type alias -- it's defined inline where needed.

---

## Forbidden Patterns

1. **`any` type** -- Do not use `any`. Use `unknown` if the type is truly unknown, then narrow it.

2. **Type assertions (`as`)** -- Avoid `as` casts. The one exception is `players.find(...)!.name` with non-null assertion when the data is guaranteed to exist (e.g., `result.list` references valid player IDs). Minimize this.

3. **Implicit `any` from untyped event handlers** -- Always type event parameters if not inferred:
   ```tsx
   onChange={e => setCash(prev => ({ ...prev, [p.id]: e.target.value }))}
   // ✓ 'e' type is inferred from the JSX element
   ```

4. **Exporting types from component files** -- Types defined in component files should stay local. Only `src/types/` exports shared types.
