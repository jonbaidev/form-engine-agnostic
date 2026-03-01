export type Operator = "eq" | "neq" | "in" | "nin";

export type When = {
    fieldId: string,
    operator: Operator,
    value: any
}

export type FieldType = 
    "text" |
    "number" |
    "select" | 
    "toggle" |
    "file" |
    "group" | 
    "custom";

export type Option = { label: string; value: string | number };

export type FieldSchema = {
    id: string;
    type: FieldType,
    label?: string,
    placeholder?: string,
    defaultValue?: unknown

    //layout
    colSpan?: number,
    helpText?: string,

    //validation
    required?: boolean,

    //conditions
    visibleWhen?: When,
    enabledWhen?: When,

    //select
    options?: Option[],

    file?: {
        accept?: string[],
        maxSizeMb?: number,
        multiple?: boolean,
        maxFiles?: number
    },

    //extensibility 
    customRendererKey?: string,
}

export type FormSchema = {
    id: string,
    title?: string,
    fields: FieldSchema[]
}

export type FormValues = Record<string, any>;

export type FieldState = {
    id: string,
    visible: boolean,
    enabled: boolean,
    touched: boolean,
    error?: string;
}

export type FormState = {
    values: FormValues,
    fields: Record<string, FieldState>,
    isValid: boolean
}
