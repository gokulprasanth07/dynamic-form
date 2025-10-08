# Dynamic Form — React + TypeScript

A small demo app that renders dynamic forms from a JSON schema, supports validation, and outputs structured form data.

## Features

- Render form fields from a JSON schema
- Supports input types: `text`, `textarea`, `date`, `dropdown` (single), `multiselect`, `checkbox`
- Validation rules: `required`, `pattern` (regex), `minLength`, `maxLength`
- Field-level validation messages
- Displays submitted JSON on screen and logs to console
- Reusable `DynamicForm` component for any schema
- Optional: conditional rendering via `dependsOn`, `readonly`, `disabled`, `hidden` attributes

## Install & Run

1. Ensure Node.js 18+ is installed.
2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm start
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

## JSON Schema Example

```json
{
  "title": "Form Title",
  "fields": [
    /* Field objects */
  ]
}
```

### Field Object Structure

```typescript
{
  label: string,               // UI label
  name: string,                // unique form key (used in submitted output)
  type: "text" | "textarea" | "date" | "dropdown" | "multiselect" | "checkbox",
  required?: boolean,          // built-in validation
  validation?: {
   pattern?: string,          // regex string (no flags). Example: "^[a-z0-9]+@[a-z0-9.-]+$"
   message?: string,          // custom error message for pattern
   minLength?: number,
   maxLength?: number
  },
  options?: string[],          // for dropdown / multiselect
  placeholder?: string,        // optional placeholder for inputs/selects
  readonly?: boolean,          // renders input as readonly
  disabled?: boolean,          // renders input disabled
  hidden?: boolean,            // will not render the field
  dependsOn?: {                // optional simple conditional rendering
   field: string,             // name of the field to depend on
   value: any                 // show this field only when dependsOn.field === value
  }
}
```

### Value Types

- `text`, `textarea`, `date` → `string` (date uses browser date input value, `YYYY-MM-DD`)
- `dropdown` → `string` (single selected option)
- `multiselect` → `string[]` (array of selected option strings, default `[]`)
- `checkbox` → `boolean` (`true` or `false`)

### Validation & Behavior Notes

- `required` triggers a simple required validation with a default message: "`<Label>` is required".
- `validation.pattern` should be a valid JavaScript regex string (no flags). If invalid, pattern is ignored.
- `validation.message` overrides the default pattern error message.
- `minLength` / `maxLength` apply to `text` / `textarea`.
- `dependsOn` is a strict equality check (`===`) against the watched field value. If not matched, the field does not render.
- `hidden: true` removes the field from rendering completely (useful for internal/meta fields).
- `readonly` and `disabled` are passed to the input element and do not change validation rules (disabled inputs are not editable by the user but still serialized unless you alter behavior).
- `placeholder` is used for single selects as the disabled default option and for text inputs as usual.

### Example Output

```json
{
  "title": "User Registration",
  "fields": [
    {
      "label": "Full Name",
      "name": "fullName",
      "type": "text",
      "required": true
    },
    {
      "label": "Email",
      "name": "email",
      "type": "text",
      "required": true,
      "validation": {
        "pattern": "^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$",
        "message": "Invalid email address"
      }
    },
    { "label": "Date of Birth", "name": "dob", "type": "date" },
    {
      "label": "Gender",
      "name": "gender",
      "type": "dropdown",
      "options": ["Male", "Female", "Other"],
      "required": true
    },
    {
      "label": "Hobbies",
      "name": "hobbies",
      "type": "multiselect",
      "options": ["Reading", "Sports", "Music", "Travel"]
    },
    {
      "label": "Subscribe to newsletter",
      "name": "subscribe",
      "type": "checkbox"
    },
    { "label": "About Yourself", "name": "about", "type": "textarea" }
  ]
}
```
