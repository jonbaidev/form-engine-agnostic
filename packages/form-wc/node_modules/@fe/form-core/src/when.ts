import { When, FormValues } from "./types";

export function evalWhen(when: When | undefined, values: FormValues): boolean {
    if (!when) return true;

    const left = values[when.fieldId];
    const right = when.value;

    switch (when.operator) {
        case "eq": return left === right;
        case "neq": return left !== right;
        case "in": return Array.isArray(right) ? right.includes(left) : false;
        case "nin": return Array.isArray(right) ? !right.includes(left) : false;
        default: return false;
    }
}