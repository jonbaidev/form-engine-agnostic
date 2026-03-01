type Operator = "eq" | "neq" | "in" | "nin";
type When = {
    fieldId: string;
    operator: Operator;
    value: any;
};
type FieldType = "text" | "number" | "select" | "toggle" | "file" | "group" | "custom";
type Option = {
    label: string;
    value: string | number;
};
type FieldSchema = {
    id: string;
    type: FieldType;
    label?: string;
    placeholder?: string;
    defaultValue?: unknown;
    colSpan?: number;
    helpText?: string;
    required?: boolean;
    visibleWhen?: When;
    enabledWhen?: When;
    options?: Option[];
    file?: {
        accept?: string[];
        maxSizeMb?: number;
        multiple?: boolean;
        maxFiles?: number;
    };
    customRendererKey?: string;
};
type FormSchema = {
    id: string;
    title?: string;
    fields: FieldSchema[];
};
type FormValues = Record<string, any>;
type FieldState = {
    id: string;
    visible: boolean;
    enabled: boolean;
    touched: boolean;
    error?: string;
};
type FormState = {
    values: FormValues;
    fields: Record<string, FieldState>;
    isValid: boolean;
};

declare function evalWhen(when: When | undefined, values: FormValues): boolean;

type Listener = (state: FormState) => void;
declare class FormStore {
    private schema;
    private state;
    private listeners;
    constructor(schema: FormSchema, initialValues?: FormValues);
    getState(): FormState;
    subscribe(listener: Listener): () => boolean;
    private emit;
    setValue(fieldId: string, value: any): void;
    touch(fieldId: string): void;
}

export { type FieldSchema, type FieldState, type FieldType, type FormSchema, type FormState, FormStore, type FormValues, type Operator, type Option, type When, evalWhen };
