import { LitElement, css, html } from "lit"
import { customElement, property, state } from "lit/decorators.js"
import type { FormSchema, FormValues } from "@fe/form-core"
import { FormStore } from "@fe/form-core"

@customElement("x-form") 
export class XForm extends LitElement {
    static styles = css`
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

@property({ attribute: false}) schema!: FormSchema;
@property({ attribute: false}) initialValues?: FormValues;

private store?: FormStore;

@state() private snap = { values: {}, fields: {}, isValid: false} as any;

connectedCallback() {
    super.connectedCallback();
    this.initStore();
}

updated(changed: Map<string, any>) {
  if (changed.has("schema") || changed.has("initialValues")) {
    this.initStore();
  }
}

private initStore() {
    if(!this.schema) return;

    this.store = new FormStore(this.schema, this.initialValues);
    this.store.subscribe((s: any) => {
        this.snap = s as any;
    })
}

private setValue(id: string, value: any) {
    this.store?.setValue(id, value);
    this.dispatchEvent(
        new CustomEvent("x-change", { detail: { id, value, values: this.snap.values}})
    )
}

private submit() {
    this.dispatchEvent(
        new CustomEvent("x-submit", { 
            detail: { values: this.snap.values, isValid: this.snap.isValid }
    })
    )
}


render() {
    if(!this.schema) return html``;

    return html`
     ${ this.schema.title ? html`<div class="title">${this.schema.title}</div>` : null}

    ${this.schema.fields.map((field: any) => {
  const fs = this.snap.fields?.[field.id];
  if (fs && !fs.visible) return null;

  const value = this.snap.values?.[field.id] ?? "";

  return html`
    <div class="field">
      ${field.label ? html`<label for=${field.id}>${field.label}</label>` : null}

      ${field.type === "text"
        ? html`
            <input
              id=${field.id}
              .value=${String(value ?? "")}
              ?disabled=${fs ? !fs.enabled : false}
              placeholder=${field.placeholder ?? ""}
              @input=${(e: Event) => {
                const input = e.target as HTMLInputElement;
                this.setValue(field.id, input.value);
              }}
              @blur=${() => this.store?.touch(field.id)}
            />
          `
        : null}

      ${field.type === "number"
        ? html`
            <input
              id=${field.id}
              type="number"
              .value=${value === null ? "" : String(value)}
              ?disabled=${fs ? !fs.enabled : false}
              placeholder=${field.placeholder ?? ""}
              @input=${(e: Event) => {
                const input = e.target as HTMLInputElement;
                this.setValue(field.id, input.value === "" ? null : Number(input.value));
              }}
              @blur=${() => this.store?.touch(field.id)}
            />
          `
        : null}

      ${field.type === "select"
        ? html`
            <select
              id=${field.id}
              .value=${String(value ?? "")}
              ?disabled=${fs ? !fs.enabled : false}
              @change=${(e: Event) => {
                const select = e.target as HTMLSelectElement;
                this.setValue(field.id, select.value);
              }}
              @blur=${() => this.store?.touch(field.id)}
            >
              <option value="">Selecione...</option>
              ${(field.options ?? []).map(
                (opt: any) => html`<option value=${String(opt.value)}>${opt.label}</option>`
              )}
            </select>
          `
        : null}

      ${fs?.touched && fs?.error ? html`<div class="error">${fs.error}</div>` : null}
    </div>
  `;
})}

    <div class="actions">
        <button @click=${this.submit} ? disabled=${!this.snap.isValid}>Submit</button>
        <button @click=${() => console.log(this.snap)}>Debug</button>
    </div>`
    }
}
