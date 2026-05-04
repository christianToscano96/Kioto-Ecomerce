# Autoskills Compatibility Layer for KIOTO

This document maps autoskills to OpenCode-compatible skills for this project's stack.

## Project Stack Analysis
- **Frontend**: React 19, Vite, Zustand, Tailwind CSS 4
- **Backend**: Express, Mongoose, Stripe
- **Testing**: Vitest, Playwright
- **Shared**: Zod 4, TypeScript

## Relevant Autoskills Mappings

### Frontend Skills
| Autoskill | OpenCode Equivalent | Usage |
|-----------|------------------|-------|
| react-best-practices | react-19 | React 19 patterns |
| composition-patterns | zustand-5 | State patterns |
| tailwind-css-patterns | tailwind-4 | Styling |
| vitest | playwright | Testing |
| stripe-best-practices | - | Stripe integration |

### Key Patterns from Autoskills Applied to KIOTO

#### React Best Practices (React 19)
- Use `startTransition` for UI updates
- Server components where possible
- No need for `useMemo/useCallback` (React 19)
- `useDeferredValue` for slow renders

#### Stripe Best Practices
- Use client secret for payment elements
- Handle webhook retries
- Verify webhook signatures
- Store payment intent IDs

#### Tailwind CSS
- Use `cn()` utility for className merging
- Theme variables via `theme()` function
- `@apply` for component styles

## Skill Activation
Skills are auto-loaded by OpenCode based on file extensions and task context.
No manual configuration needed when working in kioto.