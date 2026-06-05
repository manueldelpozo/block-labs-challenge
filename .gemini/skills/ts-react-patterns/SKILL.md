---
name: ts-react-patterns
description: Reference cheatsheet for React 18 + strict TS patterns. Scoped to the patterns relevant in this codebase.
---

# TypeScript + React Patterns — Reference Cheatsheet

> Distilled from https://react-typescript-cheatsheet.netlify.app
> Scoped to the patterns relevant in this codebase (React 18 + strict TS).

> **Guidelines, not rules.** These patterns represent best practices and sensible defaults.
> Use your judgment — if the codebase or context calls for a different approach, prefer
> consistency with existing code over strict adherence to these recommendations.

---

## 1. Function Components

**Preferred pattern** — plain function with destructured, typed props:

```tsx
interface IMyComponentProps {
  message: string;
}

function MyComponent({ message }: IMyComponentProps) {
  return <div>{message}</div>;
}
```

**Avoid `React.FC` / `React.FunctionComponent`** — it adds no value and was
officially discouraged in CRA. The inferred return type is fine for consumers.

---

## 2. Prop Type Recipes

```tsx
type AppProps = {
  // primitives
  label: string;
  count: number;
  disabled: boolean;

  // arrays
  names: string[];
  items: { id: string; title: string }[];

  // union / literal
  status: 'idle' | 'loading' | 'success' | 'error';

  // dict
  dict: Record<string, MyType>;

  // functions — prefer explicit signatures over `Function`
  onClick: () => void;
  onChange: (id: number) => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;

  // optional
  className?: string;

  // passing setState down
  setCount: React.Dispatch<React.SetStateAction<number>>;

  // children — use ReactNode; it accepts everything React can render
  children?: React.ReactNode;

  // single React element
  icon: React.JSX.Element;

  // style prop
  style?: React.CSSProperties;

  // wrapping a native element — does NOT forward its ref
  buttonProps?: React.ComponentPropsWithoutRef<'button'>;

  // wrapping a component that DOES forward its ref
  inputProps?: React.ComponentPropsWithRef<typeof MyInput>;
};
```

**`React.ReactNode` vs `React.JSX.Element`**
- `ReactNode` = anything a component can return (string, number, element, null…) → use for `children`
- `JSX.Element` = the object returned by `React.createElement` → use when you need exactly one element

### `type` vs `interface` for props

| Use `type` | Use `interface` |
|---|---|
| Union props (`type Status = 'a' \| 'b'`) | Public library APIs (allows declaration merging) |
| Mapped/computed types | When you need `extends` or `implements` |
| Tuple types | Dict shapes |

**Rule of thumb:** `interface` for public APIs, `type` for component props/state.

---

## 3. Hooks

### `useState`

```tsx
// Primitive — inference works
const [loading, setLoading] = useState(false);

// Complex or nullable — explicit generic
const [user, setUser] = useState<User | null>(null);

// Always-set state (use with care — temporarily "lies" to TS)
const [user, setUser] = useState<User>({} as User);
```

### `useCallback`

Type the parameters inline; the return type is inferred:

```tsx
const handleClick = useCallback((id: string, index: number) => {
  // ...
  return { ok: true };
}, []);
```

> ⚠️ In React ≥ 18, `(e) => {}` without a type annotation causes a TS error.
> Always annotate callback parameters.

### `useReducer`

Use discriminated unions for actions; annotate the return type of the reducer:

```tsx
type Action =
  | { type: 'increment'; payload: number }
  | { type: 'decrement'; payload: string };

function reducer(state: typeof initialState, action: Action): typeof initialState {
  switch (action.type) {
    case 'increment': return { count: state.count + action.payload };
    case 'decrement': return { count: state.count - Number(action.payload) };
    default: throw new Error('unknown action');
  }
}

const [state, dispatch] = useReducer(reducer, initialState);
```

### `useRef`

**DOM element ref** — specific element type + `null` initial value:

```tsx
const inputRef = useRef<HTMLInputElement>(null);
// inputRef.current is HTMLInputElement | null — check before use
```

**Prefer specific types** (`HTMLDivElement` > `HTMLElement` > `Element`).

**Mutable value** (not tied to a DOM node):

```tsx
const timerRef = useRef<number | null>(null);
timerRef.current = window.setInterval(...);
```

### `useEffect` / `useLayoutEffect`

No types needed. **Don't accidentally return a value** (wrap in `{}` or `void`):

```tsx
// ❌ setTimeout returns a number — TypeScript & React will complain
useEffect(() => setTimeout(() => {}, 1000), []);

// ✅
useEffect(() => {
  setTimeout(() => {}, 1000);
}, []);
```

### Custom Hooks — tuple return

When returning an array, assert `as const` so TypeScript doesn't widen to a union:

```tsx
export function useLoading() {
  const [isLoading, setIsLoading] = useState(false);
  const load = (p: Promise<unknown>) => {
    setIsLoading(true);
    return p.finally(() => setIsLoading(false));
  };
  return [isLoading, load] as const; // [boolean, (p: Promise<unknown>) => Promise<unknown>]
}
```

> If a hook returns **more than two values**, use an object instead of a tuple.

---

## 4. Events & Forms

**Inline handlers** — let TS infer from context:

```tsx
<button onClick={(e) => { /* e is React.MouseEvent<HTMLButtonElement> */ }} />
```

**Separate handlers** — annotate the event type:

```tsx
// Annotate the argument
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setValue(e.currentTarget.value);
};

// Or annotate the handler itself (both are equivalent)
const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
  setValue(e.currentTarget.value);
};
```

**Form submit with uncontrolled inputs:**

```tsx
<form onSubmit={(e: React.SyntheticEvent) => {
  e.preventDefault();
  const target = e.target as typeof e.target & {
    email: { value: string };
    password: { value: string };
  };
  console.log(target.email.value);
}}>
```

### Common event types

| Event | Use for |
|---|---|
| `ChangeEvent<T>` | `<input>`, `<select>`, `<textarea>` value changes |
| `MouseEvent<T>` | click, mousedown, mouseenter… |
| `KeyboardEvent<T>` | keydown, keyup, keypress |
| `FocusEvent<T>` | focus, blur |
| `DragEvent<T>` | drag, drop |
| `PointerEvent<T>` | Recommended over `MouseEvent` for pointer devices |
| `WheelEvent<T>` | Scroll wheel |
| `SyntheticEvent` | Base — use when event type doesn't matter |

> ⚠️ `FormEvent` / `FormEventHandler` are deprecated in React ≥ 19.2.
> Use `SubmitEvent` / `SubmitEventHandler` instead.

---

## 5. Context

**With a default value:**

```tsx
type Theme = 'light' | 'dark';
const ThemeContext = createContext<Theme>('light');

// Provider (React 19 — render context directly)
<ThemeContext value={theme}><App /></ThemeContext>

// Consumer
const theme = use(ThemeContext); // or useContext(ThemeContext)
```

**Without a meaningful default — use `null` + a typed custom hook:**

```tsx
interface ICurrentUser { username: string }

const CurrentUserContext = createContext<ICurrentUser | null>(null);

// Custom hook that throws instead of returning null
const useCurrentUser = (): ICurrentUser => {
  const ctx = use(CurrentUserContext);
  if (!ctx) throw new Error('useCurrentUser must be used inside <CurrentUserContext>');
  return ctx;
};

// Usage — no null checks needed
const { username } = useCurrentUser();
```

**Prefer runtime throwing over type assertions** (`null!`, `{} as T`) for context — the
error message is far more useful during development.

---

## 6. Refs as Props (React 19+)

In React 19, `ref` is a regular prop — no `forwardRef` needed:

```tsx
import { ComponentPropsWithRef, useRef } from 'react';

// Option A — inherit all native element props
function MyInput(props: ComponentPropsWithRef<'input'>) {
  return <input {...props} />;
}

// Option B — explicit custom props
interface IMyInputProps {
  placeholder: string;
  ref: React.Ref<HTMLInputElement>;
}
function MyInput({ placeholder, ref }: IMyInputProps) {
  return <input ref={ref} placeholder={placeholder} />;
}
```

**React 18 / legacy `forwardRef`:**

```tsx
import { forwardRef } from 'react';

interface IProps { type: 'submit' | 'button'; children?: React.ReactNode }

export const FancyButton = forwardRef<HTMLButtonElement, IProps>(
  ({ type, children }, ref) => (
    <button ref={ref} type={type}>{children}</button>
  ),
);
FancyButton.displayName = 'FancyButton';
```

> Generic components with `forwardRef` need extra work — see the cheatsheet for
> the module-redeclaration approach.

---

## 7. CSS Custom Properties

When a `style` prop needs CSS custom properties (`--my-var`), extend `CSSProperties`:

```tsx
type TCustomStyle = React.CSSProperties & {
  [key: `--${string}`]: string | undefined;
};

interface IProps {
  style?: TCustomStyle;
}
```

---

## 8. Quick Dos & Don'ts

| ✅ DO | ❌ DON'T |
|---|---|
| Use named type imports: `import type { ReactNode } from 'react'` | Access via namespace: `React.ReactNode` (requires unused `React` import) |
| Prefer `interface` for public props; `type` for unions | Use `{}` or `Object` to mean "empty object" |
| Use `as const` for tuple returns from custom hooks | Return raw arrays from hooks (TS widens to union) |
| `useRef<HTMLDivElement>(null)` for DOM refs | `useRef(null)` without a type (loses specificity) |
| Throw in custom context hooks if context is null | Use `!` non-null assertion on context values |
| Inline event handlers when possible (TS infers the event type) | Use `Function` or `any` as an event handler type |
| `React.ComponentPropsWithoutRef<'button'>` to mirror a native element | Re-declare every prop that a native element already has |

---

## 9. `useImperativeHandle` (React 19)

```tsx
// Countdown.tsx
import { useImperativeHandle, Ref } from 'react';

export type TCountdownHandle = { start: () => void };

function Countdown({ ref }: { ref?: Ref<TCountdownHandle> }) {
  useImperativeHandle(ref, () => ({
    start() { alert('Start'); },
  }));
  return <div>Countdown</div>;
}

// Parent
const countdownRef = useRef<TCountdownHandle>(null);
countdownRef.current?.start();
return <Countdown ref={countdownRef} />;
```

---

*Source: https://react-typescript-cheatsheet.netlify.app — condensed for this codebase.*
