import { evalWhen } from "./when";
import { FieldSchema, FormSchema, FormState, FormValues } from "./types";

type Listener = (state: FormState) => void;

function buildInitialValues(schema: FormSchema, initial?: FormValues): FormValues {
    const values: FormValues = { ...(initial ?? {} )};

    for (const field of schema.fields) {
        if(values[field.id] === undefined) values[field.id] = field.defaultValue ?? null;
    }
    return values;
}

function buildInitialFieldStates(schema: FormSchema, values: FormValues) {
    const fields: FormState["fields"] = {};

    for (const field of schema.fields) {
        fields[field.id] = {
            id: field.id,
            visible: evalWhen(field.visibleWhen, values),
            enabled: evalWhen(field.enabledWhen, values),
            touched: false
        }
    }
    return fields;
}

function validateRequired(schema: FormSchema, values: FormValues) {
    //simple required validation, can be extended with custom validation rules
    const errors: Record<string, string> = {};

    for (const filed of schema.fields) {
        if(!filed.required) continue;

        const value = values[filed.id];

        const empty = 
        value === null || 
        value === undefined || 
        (typeof value === "string" && value.trim() === "") ||
        (Array.isArray(value) && value.length === 0)

        if(empty) errors[filed.id] = "This field is required*";
    }
    return errors;
}

export class FormStore {
    private schema: FormSchema
    private state: FormState
    private listeners = new Set<Listener>()

    constructor(schema: FormSchema, initialValues?: FormValues) {
        this.schema = schema;
        const values = buildInitialValues(schema, initialValues);
        const fields = buildInitialFieldStates(schema, values);
        const errors = validateRequired(schema, values);

        for(const id of Object.keys(fields)) fields[id].error = errors[id];

        this.state = {
            values,
            fields,
            isValid: Object.values(errors).every(error => !error)
        }
    }

    getState() {
      return this.state;
    }

    subscribe(listener: Listener) {
        this.listeners.add(listener)
        listener(this.state)
        return () => this.listeners.delete(listener)
    }

    private emit() {
        for (const listener of this.listeners) listener(this.state);
    }

    setValue(fieldId: string, value: any) {
        const nextValues = { ...this.state.values, [fieldId]: value }

        //recalc conditions
        const nextFields = { ...this.state.fields }
        for (const field of this.schema.fields) {
            const prev = nextFields[field.id];
            nextFields[field.id] = {
                ...prev,
                visible: evalWhen(field.visibleWhen, nextValues),
                enabled: evalWhen(field.enabledWhen, nextValues)
            }
        }

        const errors = validateRequired(this.schema, nextValues)
        for(const id of Object.keys(nextFields)) {
            nextFields[id] = { ...nextFields[id], error: errors[id]}
        }

        this.state = {
            values: nextValues,
            fields: nextFields,
            isValid: Object.values(errors).every(error => !error)
        }
        this.emit()
    }

    touch(fieldId: string) {
        const field = this.state.fields[fieldId]

        if(!field) return;

        this.state = {
            ...this.state,
            fields: {
                ...this.state.fields, [fieldId]: { ...field, touched: true }
            }
        }
    this.emit()
    }

}