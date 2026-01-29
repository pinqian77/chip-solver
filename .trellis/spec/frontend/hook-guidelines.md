# Hook Guidelines

> How hooks are used in this project.

---

## Overview

This project has one custom hook (`useGame`) that lives inside the context file. There is no data fetching -- all state is client-side. Hooks follow standard React conventions.

---

## Custom Hook Patterns

### `useGame` -- The primary custom hook

Defined in `src/context/GameContext.tsx`:

```tsx
export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be inside GameProvider');
  return ctx;
}
```

**Pattern:** Context accessor hook with a runtime guard.

**Returns:** `{ players, events, dispatch }` where `dispatch` is a `React.Dispatch<Action>`.

**Usage:**
```tsx
const { players, events, dispatch } = useGame();
```

### Convention for new custom hooks

If new hooks are needed:

1. **Context hooks** go in the context file (e.g., `useGame` in `GameContext.tsx`)
2. **Utility hooks** would go in a `hooks/` directory (does not exist yet -- create if needed)
3. Always prefix with `use`
4. Always include a guard if accessing context: throw if used outside provider
5. Export as a named export

---

## Data Fetching

**Not applicable.** This is a fully client-side app with no API calls. All data lives in React state via `useReducer`.

If data fetching is added in the future, consider a library like React Query or SWR rather than manual `useEffect` fetching.

---

## Naming Conventions

| Pattern | Convention | Example |
|---------|-----------|---------|
| Context accessor | `use{ContextName}` (drop "Context") | `useGame` (not `useGameContext`) |
| Derived state | `useMemo` inline | `const totalBuy = useMemo(...)` in `PlayerTable.tsx:17` |
| Local state | `useState` with descriptive name | `const [phase, setPhase] = useState<'play' \| 'settle' \| 'done'>('play')` |

---

## Hook Usage in Components

### State hooks

```tsx
// src/pages/HomePage.tsx
const [phase, setPhase] = useState<'play' | 'settle' | 'done'>('play');
const [cash, setCash] = useState<Record<string, string>>(() =>
  Object.fromEntries(players.map(p => [p.id, '']))
);
```

- Use explicit generic types for `useState` when the type isn't obvious from the initial value
- Use lazy initializer (`() => ...`) for computed initial state

### Derived values with `useMemo`

```tsx
// src/components/PlayerTable.tsx:17-22
const totalBuy = useMemo(() => {
  const obj: Record<string, number> = {};
  players.forEach(p => (obj[p.id] = 0));
  events.forEach(e => (obj[e.playerId] += e.amount));
  return obj;
}, [players, events]);
```

- Use `useMemo` for computed values derived from state
- Always provide correct dependency arrays

### Layout effects

```tsx
// src/pages/HomePage.tsx:24-26
useLayoutEffect(() => {
  if (tableRef.current) setCenterHeight(tableRef.current.offsetHeight);
});
```

- Use `useLayoutEffect` (not `useEffect`) for DOM measurements that affect layout

---

## Common Mistakes

1. **Forgetting the context guard** -- Always throw if context is undefined. This catches misuse early.

2. **Using `useEffect` for DOM measurements** -- Use `useLayoutEffect` to avoid visual flicker.

3. **Missing dependency array entries** -- ESLint `react-hooks/exhaustive-deps` will warn about this.
