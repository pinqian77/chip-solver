# State Management

> How state is managed in this project.

---

## Overview

State management uses **React Context + `useReducer`** for global state and **`useState`** for local/page-level state. There is no external state library (no Redux, Zustand, etc.) and no server state.

---

## State Categories

### Global state (Context + useReducer)

**What:** Core game data -- players and events (buy-in records).

**Where:** `src/context/GameContext.tsx`

**Shape:**
```tsx
interface State {
  players: Player[];   // { id: string, name: string }
  events: Event[];     // { id, playerId, amount, type, createdAt }
}
```

**Actions:**
```tsx
type Action =
  | { type: 'addPlayer'; name: string }
  | { type: 'removePlayer'; id: string }
  | { type: 'buyin'; playerId: string; amount: number }
  | { type: 'removeEvent'; eventId: string };
```

**Access:** Via the `useGame()` hook which returns `{ players, events, dispatch }`.

**Provider:** `GameProvider` wraps the entire app in `App.tsx`:
```tsx
<GameProvider>
  <BrowserRouter basename="/chip-solver">
    <HomePage />
  </BrowserRouter>
</GameProvider>
```

### Local state (useState in pages/components)

**What:** UI-specific state that doesn't need to be shared globally.

**Where:** Declared in the component that owns it, passed down via props.

**Examples from `src/pages/HomePage.tsx`:**

| State | Type | Purpose |
|-------|------|---------|
| `phase` | `'play' \| 'settle' \| 'done'` | Current game phase |
| `cash` | `Record<string, string>` | Cashout input values per player |
| `validateOK` | `boolean` | Whether totals have been validated |
| `result` | `ReturnType<typeof settle> \| null` | Settlement calculation result |
| `error` | `string \| null` | Validation error message |
| `centerHeight` | `number` | DOM measurement for layout sync |

### Derived state

Computed inline, not stored separately:

```tsx
// src/pages/HomePage.tsx:29-30
const totalBuy = events.reduce((s, e) => s + e.amount, 0);
const totalCash = players.reduce((s, p) => s + (Number(cash[p.id]) || 0), 0);
```

Or via `useMemo` when used in render-heavy components:

```tsx
// src/components/PlayerTable.tsx:17-22
const totalBuy = useMemo(() => { ... }, [players, events]);
```

---

## When to Use Global State

Put state in `GameContext` when:
- It represents **core game data** (players, events)
- It needs to be **accessed by multiple components** (PlayerTable, EventLog, HomePage all need players/events)
- It should **survive phase transitions** (players persist across play/settle/done)

Keep state local when:
- It's **UI-only** (phase, validation status, error messages)
- It's **owned by a single component** or passed to direct children only
- It's **transient** (input field values, animation state)

---

## Server State

**Not applicable.** This is a fully client-side app with no backend or API. All data is ephemeral -- lost on page refresh.

---

## Reducer Pattern

The reducer uses a discriminated union on `action.type`:

```tsx
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'addPlayer':
      return { ...state, players: [...state.players, { id: nanoid(), name: action.name }] };
    case 'removePlayer':
      return {
        ...state,
        players: state.players.filter(p => p.id !== action.id),
        events: state.events.filter(e => e.playerId !== action.id),  // cascade delete
      };
    // ...
  }
}
```

**Key convention:** `removePlayer` cascades to remove related events. When adding new entity types, consider cascade effects.

**ID generation:** Uses `nanoid()` inside the reducer for new entities.

---

## Common Mistakes

1. **Storing derived data in state** -- Don't store `totalBuy` in state; compute it from `events`. This avoids sync bugs.

2. **Putting UI state in context** -- Phase, validation status, and error messages belong in `HomePage` local state, not in `GameContext`.

3. **Forgetting cascade deletes** -- When removing an entity, check if other state references it (e.g., removing a player must also remove their events).

4. **Using string for chip inputs** -- `cash` values are stored as strings (for input binding) and converted to numbers only when needed for calculation. Don't convert prematurely.
