# Directory Structure

> How frontend code is organized in this project.

---

## Overview

Chip Solver is a single-page React + TypeScript app built with Vite. The codebase is small and flat -- no deeply nested feature folders. Each directory under `src/` has a clear, single responsibility.

---

## Directory Layout

```
src/
├── main.tsx                  # React entry point (StrictMode + App)
├── App.tsx                   # Root component: GameProvider > BrowserRouter > HomePage
├── index.css                 # Global styles, Tailwind @apply classes, theme
├── vite-env.d.ts             # Vite type declarations
├── algorithms/
│   └── settle.ts             # Pure business logic (no React imports)
├── components/
│   ├── BuyButton.tsx          # Buy-in action button
│   ├── EventLog.tsx           # Chronological event list with undo
│   ├── NeonButton.tsx         # Reusable neon-styled button
│   └── PlayerTable.tsx        # Player list table with add/buy-in/cashout
├── context/
│   └── GameContext.tsx         # React Context + useReducer + useGame hook
├── pages/
│   └── HomePage.tsx           # Single page: 3-phase layout
├── types/
│   └── poker.ts               # Shared TypeScript interfaces
├── utils/
│   └── buyinSum.ts            # Helper to sum buy-ins per player
└── assets/                    # Static assets (currently empty)
```

**Root config files:**
- `vite.config.ts` -- Vite config with `base: '/chip-solver/'` for GitHub Pages
- `tailwind.config.js` -- Custom neon theme colors, fonts, shadows
- `eslint.config.js` -- ESLint 9 flat config with typescript-eslint + react-hooks
- `tsconfig.json` / `tsconfig.app.json` / `tsconfig.node.json`

---

## Module Organization

Each directory has a specific purpose:

| Directory | Contains | Import Rule |
|-----------|----------|-------------|
| `algorithms/` | Pure functions with no React dependency | Import types from `types/`, nothing else from `src/` |
| `components/` | Reusable UI components | Can import from `context/`, `types/`, other components |
| `context/` | React Context providers + hooks | Imports from `types/` only |
| `pages/` | Page-level components (orchestrators) | Can import from all directories |
| `types/` | TypeScript interfaces and type aliases | No imports from other `src/` directories |
| `utils/` | Small helper functions | Imports from `types/` only |

**Key rule:** `algorithms/` and `types/` must remain free of React imports. This keeps business logic testable without React.

---

## Naming Conventions

| Category | Convention | Example |
|----------|-----------|---------|
| React components | PascalCase `.tsx` | `BuyButton.tsx`, `PlayerTable.tsx` |
| Pages | PascalCase `.tsx` | `HomePage.tsx` |
| Context files | PascalCase `.tsx` | `GameContext.tsx` |
| Pure logic / utils | camelCase `.ts` | `settle.ts`, `buyinSum.ts` |
| Type definition files | camelCase `.ts` | `poker.ts` |

- One component per file
- File name matches the default export name

---

## Examples

**Well-structured algorithm module:** `src/algorithms/settle.ts`
- Pure function, no React
- Imports only from `types/poker.ts`
- Returns a plain object

**Well-structured context module:** `src/context/GameContext.tsx`
- Contains provider, reducer, and custom hook in one file
- Exports `GameProvider` (named) and `useGame` (named)

**Well-structured component:** `src/components/NeonButton.tsx`
- Single responsibility, reusable
- Props typed inline
- Default export
