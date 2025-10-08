/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { DynamicForm } from "./components/DynamicForm";
import type { FormSchema } from "./types";
import "./index.css";


const userRegistrationSchema: FormSchema = {
  title: "User Registration",
  fields: [
    { label: "Full Name", name: "fullName", type: "text", required: true, placeholder: "First Last" },
    {
      label: "Email",
      name: "email",
      type: "text",
      required: true,
      validation: {
        pattern: "^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$",
        message: "Invalid email address"
      },
      placeholder: "you@example.com"
    },
    { label: "Date of Birth", name: "dob", type: "date" },
    { label: "Gender", name: "gender", type: "dropdown", options: ["Male", "Female", "Other"], required: true },
    { label: "Hobbies", name: "hobbies", type: "multiselect", options: ["Reading", "Sports", "Music", "Travel"] },
    { label: "Subscribe to newsletter", name: "subscribe", type: "checkbox" },
    { label: "About Yourself", name: "about", type: "textarea" }
  ]
};

// Bonus schema: shows conditional rendering & readonly/hidden example
const conditionalSchema: FormSchema = {
  title: "Conditional Survey",
  fields: [
    { label: "Are you employed?", name: "employed", type: "dropdown", options: ["Yes", "No"], required: true },
    {
      label: "Employer name",
      name: "employer",
      type: "text",
      placeholder: "Your employer",
      // show only if employed === "Yes"
      dependsOn: { field: "employed", value: "Yes" }
    },
    {
      label: "Hidden internal id",
      name: "internalId",
      type: "text",
      hidden: true,
      // this hidden field won't render but could be used internally if filled by code
    },
    {
      label: "Read-only note",
      name: "note",
      type: "text",
      readonly: true,
      // We'll not populate it programmatically in this demo; it's just to show attribute
    }
  ]
};

export default function App() {
  const [currentSchema, setCurrentSchema] = useState<FormSchema>(userRegistrationSchema);
  const [lastOutput, setLastOutput] = useState<Record<string, any> | null>(null);

  console.log(lastOutput ? "Form submitted with values:" : "No submission yet.", lastOutput);

  return (
    <div className="app">
      <div className="sidebar">
        <h3>Examples</h3>
        <button onClick={() => { setCurrentSchema(userRegistrationSchema); setLastOutput(null); }}>User Registration</button>
        <button onClick={() => { setCurrentSchema(conditionalSchema); setLastOutput(null); }}>Conditional Example</button>
      </div>

      <div className="content">
        <DynamicForm schema={currentSchema} onSubmit={(v) => setLastOutput(v)} />

        {/* <div className="output">
          <h3>Submitted Output</h3>
          {lastOutput ? (
            <pre>{JSON.stringify(lastOutput, null, 2)}</pre>
          ) : (
            <div className="muted">No submission yet. Submit the form to see structured output here (and in console).</div>
          )}
        </div> */}
      </div>
    </div>
  );
}
