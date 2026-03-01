# Form Engine — Framework-Agnostic, Schema-Driven Forms

A production-ready, extensible, framework-agnostic form engine built with:

- 🧠 TypeScript core (no UI dependencies)
- 🌐 Web Components renderer (Lit)
- ⚛️ React demo (Angular/Vue ready)
- 📦 Monorepo architecture (pnpm workspaces + Turbo)

This project demonstrates clean architecture principles, extensibility, and real-world frontend engineering patterns suitable for enterprise environments.

---

## 🚀 Vision

Modern organizations often use multiple frontend frameworks across teams and products.

This project separates:

1. **Form Logic (Core)** → pure TypeScript
2. **Rendering Layer** → Web Components
3. **Framework Integration** → thin adapters (React, Angular, Vue)

One engine. Multiple ecosystems.

---

## 🏗 Architecture
form-engine/
│
├── packages/
│ ├── form-core/ → Framework-agnostic form engine
│ ├── form-wc/ → Web Components renderer (<x-form>)
│
├── apps/
│ ├── demo-react/ → React integration example
│
└── README.md


---

## 🧠 Core Responsibilities (`form-core`)

- Schema definition (type-safe)
- Centralized form store
- Field state tracking (touched, visible, enabled)
- Conditional logic (visibleWhen, enabledWhen)
- Validation (MVP: required)
- Subscription model (observer pattern)
- No UI dependencies
- No framework coupling

---

## 🌐 Renderer (`form-wc`)

- Built with Lit
- Registers `<x-form>`
- Uses property binding (not attributes)
- Emits CustomEvents:
  - `x-change`
  - `x-submit`
- Compatible with:
  - React
  - Angular
  - Vue
  - Vanilla JS

---

## ⚛️ React Integration Example

Because Web Components emit CustomEvents, React integration uses refs:

```tsx
import { useEffect, useRef } from "react";
import "@fe/form-wc";

const schema = {
  id: "demo",
  fields: [
    { id: "name", type: "text", label: "Name", required: true }
  ]
};

export default function App() {
  const formRef = useRef<any>(null);

  useEffect(() => {
    const el = formRef.current;
    if (!el) return;

    el.schema = schema;

    el.addEventListener("x-submit", (e: any) => {
      console.log(e.detail);
    });
  }, []);

  return <x-form ref={formRef} />;
}


---

## 🧠 Core Responsibilities (`packages/form-core`)

- Type-safe schema definitions
- Centralized form store (state + subscriptions)
- Field state tracking (touched, enabled, visible)
- Conditional logic (`visibleWhen`, `enabledWhen`)
- Validation (MVP: `required`, designed to extend to async + cross-field)
- No UI framework dependencies

---

## 🌐 Renderer Responsibilities (`packages/form-wc`)

- Web Components renderer using Lit
- Registers `<x-form>`
- Uses **property binding** (not attributes) for complex objects like `schema`
- Emits CustomEvents:
  - `x-change`
  - `x-submit`

---

## 🛠 Local Development

### Requirements
- Node.js **18+** (or 20+)
- pnpm

### Install
```bash
pnpm install 
```

### Build Packages
pnpm -C packages/form-core build
pnpm -C packages/form-wc build

### Run React Demo
pnpm -C apps/demo-react dev

Open the URL shown by Vite (usually http://localhost:5173)

### Current Features 
Schema-driven rendering

Centralized state store

Required validation

Touched state tracking

Conditional visibility (visibleWhen)

Conditional enabling (enabledWhen)

Web Component renderer (<x-form>)

CustomEvents (x-change, x-submit)

React integration example

### Example Schema
import type { FormSchema } from "@fe/form-core";

export const schema: FormSchema = {
  id: "user-form",
  title: "User Registration",
  fields: [
    {
      id: "name",
      type: "text",
      label: "Full Name",
      required: true
    },
    {
      id: "role",
      type: "select",
      label: "Role",
      required: true,
      options: [
        { label: "Frontend", value: "fe" },
        { label: "Backend", value: "be" }
      ]
    }
  ]
};

### React Integration
import { useEffect, useRef } from "react";
import "@fe/form-wc";

export default function App() {
  const formRef = useRef<any>(null);

  useEffect(() => {
    const el = formRef.current;
    if (!el) return;

    el.schema = schema;

    const onSubmit = (e: Event) => {
      const ce = e as CustomEvent;
      console.log("submit:", ce.detail);
    };

    el.addEventListener("x-submit", onSubmit);

    return () => {
      el.removeEventListener("x-submit", onSubmit);
    };
  }, []);

  return <x-form ref={formRef} />;
}

### Roadmap
Field registry / plugin system

File upload (drag & drop + validation + progress)

Phone input (country selector + normalization)

Async validation (server-side checks)

Cross-field validation

Computed fields

Multi-step forms (wizard)

Async data sources (remote selects)

Theming system (design tokens + skins)

Angular demo

Vue demo

Unit tests (core)

E2E tests

CI workflow

Semantic versioning

