import { useEffect, useRef } from "react";
import type { FormSchema } from "@fe/form-core";

const schema: FormSchema = {
  id: "demo",
  title: "Form Engine MVP (React + Web Components)",
  fields: [
    { id: "name", type: "text", label: "Name", required: true, placeholder: "Type your name..." },
    {
      id: "role",
      type: "select",
      label: "Role",
      required: true,
      options: [
        { label: "Frontend", value: "fe" },
        { label: "Backend", value: "be" }
      ]
    },
    {
      id: "years",
      type: "number",
      label: "Years of experience",
      required: true,
      enabledWhen: { fieldId: "role", operator: "neq", value: "" }
    },
    {
      id: "github",
      type: "text",
      label: "GitHub",
      visibleWhen: { fieldId: "role", operator: "eq", value: "fe" },
      placeholder: "https://github.com/..."
    }
  ]
};

export default function App() {
  const formRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = formRef.current as HTMLElement & { schema: FormSchema };
    if (!el) return;

    // ✅ setar como PROPRIEDADE (não atributo)
    el.schema = schema;

    const onSubmit = (e: Event) => {
      const ce = e as CustomEvent;
      alert(JSON.stringify(ce.detail, null, 2));
    };

    el.addEventListener("x-submit", onSubmit);
    return () => el.removeEventListener("x-submit", onSubmit);
  }, []);

  return (
    <div style={{ maxWidth: 560, margin: "40px auto", padding: 16 }}>
      <x-form ref={formRef} />
    </div>
  );
}