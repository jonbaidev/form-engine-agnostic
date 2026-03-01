"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp(target, key, result);
  return result;
};

// src/x-form.ts
var import_lit = require("lit");
var import_decorators = require("lit/decorators.js");
var import_form_core = require("@fe/form-core");
var XForm = class extends import_lit.LitElement {
  constructor() {
    super(...arguments);
    this.snap = { values: {}, fields: {}, isValid: false };
  }
  connectedCallback() {
    super.connectedCallback();
    this.initStore();
  }
  updated(changed) {
    if (changed.has("schema") || changed.has("initialValues")) {
      this.initStore();
    }
  }
  initStore() {
    if (!this.schema) return;
    this.store = new import_form_core.FormStore(this.schema, this.initialValues);
    this.store.subscribe((s) => {
      this.snap = s;
    });
  }
  setValue(id, value) {
    this.store?.setValue(id, value);
    this.dispatchEvent(
      new CustomEvent("x-change", { detail: { id, value, values: this.snap.values } })
    );
  }
  submit() {
    this.dispatchEvent(
      new CustomEvent("x-submit", {
        detail: { values: this.snap.values, isValid: this.snap.isValid }
      })
    );
  }
  render() {
    if (!this.schema) return import_lit.html``;
    return import_lit.html`
     ${this.schema.title ? import_lit.html`<div class="title">${this.schema.title}</div>` : null}

    ${this.schema.fields.map((field) => {
      const fs = this.snap.fields?.[field.id];
      if (fs && !fs.visible) return null;
      const value = this.snap.values?.[field.id] ?? "";
      return import_lit.html`
    <div class="field">
      ${field.label ? import_lit.html`<label for=${field.id}>${field.label}</label>` : null}

      ${field.type === "text" ? import_lit.html`
            <input
              id=${field.id}
              .value=${String(value ?? "")}
              ?disabled=${fs ? !fs.enabled : false}
              placeholder=${field.placeholder ?? ""}
              @input=${(e) => {
        const input = e.target;
        this.setValue(field.id, input.value);
      }}
              @blur=${() => this.store?.touch(field.id)}
            />
          ` : null}

      ${field.type === "number" ? import_lit.html`
            <input
              id=${field.id}
              type="number"
              .value=${value === null ? "" : String(value)}
              ?disabled=${fs ? !fs.enabled : false}
              placeholder=${field.placeholder ?? ""}
              @input=${(e) => {
        const input = e.target;
        this.setValue(field.id, input.value === "" ? null : Number(input.value));
      }}
              @blur=${() => this.store?.touch(field.id)}
            />
          ` : null}

      ${field.type === "select" ? import_lit.html`
            <select
              id=${field.id}
              .value=${String(value ?? "")}
              ?disabled=${fs ? !fs.enabled : false}
              @change=${(e) => {
        const select = e.target;
        this.setValue(field.id, select.value);
      }}
              @blur=${() => this.store?.touch(field.id)}
            >
              <option value="">Selecione...</option>
              ${(field.options ?? []).map(
        (opt) => import_lit.html`<option value=${String(opt.value)}>${opt.label}</option>`
      )}
            </select>
          ` : null}

      ${fs?.touched && fs?.error ? import_lit.html`<div class="error">${fs.error}</div>` : null}
    </div>
  `;
    })}

    <div class="actions">
        <button @click=${this.submit} ? disabled=${!this.snap.isValid}>Submit</button>
        <button @click=${() => console.log(this.snap)}>Debug</button>
    </div>`;
  }
};
XForm.styles = import_lit.css`
      :host {
      display: block;
      font-family: system-ui, Arial;
      }
      
      .title {
        font-size: 18px;
        font-weight: 700;
        margin-bottom: 12px;
      }

      .field {
        margin-bottom: 12px;
      }

      label {
        display: block;
        font-size: 12px;
        margin-bottom: 6px;
        opacity: 0.85;
      }
      input, select {
        width: 100%;
        padding: 10px;
        border-radius: 10px;
        border: 1px solid rgba(0,0,0,0.15);
        outline: none;
      }
      input:disabled, select:disabled {
        opacity: 0.6;
      }
      .error {
        margin-top: 6px;
        font-size: 12px;
        color: #b00020;
      }
      .actions {
        margin-top: 16px;
        display: flex;
        gap: 10x;
      }
      button {
        padding: 10px 12px;
        border-radius: 12px;
        border: 1px solid rgba(0,0,0,0.15);
        background: white;
        cursor: pointer;
      }
    `;
__decorateClass([
  (0, import_decorators.property)({ attribute: false })
], XForm.prototype, "schema", 2);
__decorateClass([
  (0, import_decorators.property)({ attribute: false })
], XForm.prototype, "initialValues", 2);
__decorateClass([
  (0, import_decorators.state)()
], XForm.prototype, "snap", 2);
XForm = __decorateClass([
  (0, import_decorators.customElement)("x-form")
], XForm);
