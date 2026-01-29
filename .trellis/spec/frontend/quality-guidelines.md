# Quality Guidelines

> Code quality standards for frontend development.

---

## Overview

Quality is enforced via ESLint (with TypeScript and React plugins), TypeScript strict mode, and manual testing. There are no automated tests yet, though Vitest is configured.

---

## Linting & Type Checking

### Commands

```bash
npx eslint .          # Run ESLint
npx tsc --noEmit      # Run TypeScript type check
npm run build         # Full production build (includes type check)
```

### ESLint Configuration

Defined in `eslint.config.js` (ESLint 9 flat config):

- Base: `@eslint/js` recommended + `typescript-eslint` recommended
- Plugins: `react-hooks` (recommended rules), `react-refresh`
- Scope: `**/*.{ts,tsx}` files only
- Ignores: `dist/`

Key enforced rules:
- **react-hooks/rules-of-hooks** -- Hooks must follow React rules
- **react-hooks/exhaustive-deps** -- Dependency arrays must be complete
- **react-refresh/only-export-components** -- Warn if non-component exports exist in component files

### TypeScript

Strict mode enabled via `tsconfig.app.json`. Do not weaken strictness settings.

---

## Forbidden Patterns

1. **`console.log` in committed code** -- Remove debug logs before committing.

2. **Inline styles for theme values** -- Use Tailwind classes or custom CSS classes from `index.css`. Don't hardcode hex colors in JSX.
   ```tsx
   // Bad
   <div style={{ color: '#00F9FF' }}>
   // Good
   <div className="text-neonCyan">
   ```

3. **Direct DOM manipulation** -- Use React state and refs, not `document.querySelector`.

4. **`var` declarations** -- Use `const` or `let`.

5. **Unused imports or variables** -- ESLint + TypeScript will flag these. Remove them.

6. **CSS in JS objects when Tailwind exists** -- Use Tailwind utility classes. The only exception is dynamic `style` props for values that can't be expressed in Tailwind (e.g., `gridTemplateColumns` in `HomePage.tsx:85`).

---

## Required Patterns

1. **Use `clsx` for conditional classes** -- Not template literals or string concatenation.

2. **Use custom CSS classes for repeated patterns** -- If a Tailwind combination appears more than twice, define it as a class in `index.css` with `@apply`.

3. **Use `nanoid()` for ID generation** -- Not `Math.random()` or `Date.now()`.

4. **Use `Number.isFinite()` to validate numeric input** -- Not just truthy checks.

5. **Immutable state updates** -- Always spread or filter to create new arrays/objects in the reducer. Never mutate state directly.

---

## Testing Requirements

### Current state

- **Vitest** is configured in `devDependencies` but no test files exist yet.
- **`@testing-library/react`** is available for component testing.
- Manual testing is currently the primary verification method.

### When adding tests

```bash
npx vitest           # Run tests
npx vitest --run     # Run tests once (CI mode)
```

- Place test files next to the source file: `settle.test.ts` beside `settle.ts`
- Or use a `__tests__/` directory within each module folder
- Test pure functions (like `settle`) first -- they are easiest to test
- Use `@testing-library/react` for component tests

---

## Code Review Checklist

Before committing, verify:

- [ ] `npx eslint .` passes with no errors
- [ ] `npx tsc --noEmit` passes with no errors
- [ ] `npm run build` succeeds
- [ ] No `console.log` statements left in code
- [ ] No hardcoded colors -- use Tailwind theme tokens
- [ ] Conditional classes use `clsx`
- [ ] New interactive elements respect the `phase` gating pattern
- [ ] State updates are immutable
- [ ] Manual testing of the feature works across play/settle/done phases
