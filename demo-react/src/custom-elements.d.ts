import type { FormSchema, FormValues } from "@fe/form-core";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "x-form": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        schema?: FormSchema;
        initialValues?: FormValues;
      };
    }
  }
}

export {};