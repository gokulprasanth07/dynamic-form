/* eslint-disable @typescript-eslint/no-explicit-any */
export type FieldType = "text" | "textarea" | "date" | "dropdown" | "multiselect" | "checkbox";

export interface ValidationRule {
  pattern?: string; // regex string
  message?: string; // custom message for pattern
  minLength?: number;
  maxLength?: number;
}

export interface FieldSchema {
  label: string;
  name: string;
  type: FieldType;
  required?: boolean;
  validation?: ValidationRule;
  options?: string[]; // for dropdown/multiselect
  readonly?: boolean;
  disabled?: boolean;
  hidden?: boolean;
  // Optional conditional rendering: show this field only when other field has a value (simple support)
  dependsOn?: {
    field: string;
    value: any;
  };
  placeholder?: string;
}

export interface FormSchema {
  title?: string;
  fields: FieldSchema[];
}