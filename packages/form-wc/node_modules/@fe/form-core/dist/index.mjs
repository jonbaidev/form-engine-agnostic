// src/when.ts
function evalWhen(when, values) {
  if (!when) return true;
  const left = values[when.fieldId];
  const right = when.value;
  switch (when.operator) {
    case "eq":
      return left === right;
    case "neq":
      return left !== right;
    case "in":
      return Array.isArray(right) ? right.includes(left) : false;
    case "nin":
      return Array.isArray(right) ? !right.includes(left) : false;
    default:
      return false;
  }
}

// src/store.ts
function buildInitialValues(schema, initial) {
  const values = { ...initial ?? {} };
  for (const field of schema.fields) {
    if (values[field.id] === void 0) values[field.id] = field.defaultValue ?? null;
  }
  return values;
}
function buildInitialFieldStates(schema, values) {
  const fields = {};
  for (const field of schema.fields) {
    fields[field.id] = {
      id: field.id,
      visible: evalWhen(field.visibleWhen, values),
      enabled: evalWhen(field.enabledWhen, values),
      touched: false
    };
  }
  return fields;
}
function validateRequired(schema, values) {
  const errors = {};
  for (const filed of schema.fields) {
    if (!filed.required) continue;
    const value = values[filed.id];
    const empty = value === null || value === void 0 || typeof value === "string" && value.trim() === "" || Array.isArray(value) && value.length === 0;
    if (empty) errors[filed.id] = "This field is required*";
  }
  return errors;
}
var FormStore = class {
  constructor(schema, initialValues) {
    this.listeners = /* @__PURE__ */ new Set();
    this.schema = schema;
    const values = buildInitialValues(schema, initialValues);
    const fields = buildInitialFieldStates(schema, values);
    const errors = validateRequired(schema, values);
    for (const id of Object.keys(fields)) fields[id].error = errors[id];
    this.state = {
      values,
      fields,
      isValid: Object.values(errors).every((error) => !error)
    };
  }
  getState() {
    return this.state;
  }
  subscribe(listener) {
    this.listeners.add(listener);
    listener(this.state);
    return () => this.listeners.delete(listener);
  }
  emit() {
    for (const listener of this.listeners) listener(this.state);
  }
  setValue(fieldId, value) {
    const nextValues = { ...this.state.values, [fieldId]: value };
    const nextFields = { ...this.state.fields };
    for (const field of this.schema.fields) {
      const prev = nextFields[field.id];
      nextFields[field.id] = {
        ...prev,
        visible: evalWhen(field.visibleWhen, nextValues),
        enabled: evalWhen(field.enabledWhen, nextValues)
      };
    }
    const errors = validateRequired(this.schema, nextValues);
    for (const id of Object.keys(nextFields)) {
      nextFields[id] = { ...nextFields[id], error: errors[id] };
    }
    this.state = {
      values: nextValues,
      fields: nextFields,
      isValid: Object.values(errors).every((error) => !error)
    };
    this.emit();
  }
  touch(fieldId) {
    const field = this.state.fields[fieldId];
    if (!field) return;
    this.state = {
      ...this.state,
      fields: {
        ...this.state.fields,
        [fieldId]: { ...field, touched: true }
      }
    };
    this.emit();
  }
};
export {
  FormStore,
  evalWhen
};
