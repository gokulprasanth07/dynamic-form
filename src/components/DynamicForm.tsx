/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { FormSchema, FieldSchema } from "../types";

interface Props {
    schema: FormSchema;
    onSubmit?: (values: Record<string, any>) => void;
    submitLabel?: string;
}

export const DynamicForm: React.FC<Props> = ({ schema, onSubmit, submitLabel = "Submit" }) => {
    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({ mode: "onBlur" });

    // initialize multiselect defaults so validation and output remain same as before
    useEffect(() => {
        schema.fields.forEach((f) => {
            if (f.type === "multiselect") {
                // set default to empty array (same as Controller's defaultValue = [])
                setValue(f.name, [], { shouldValidate: false, shouldDirty: false });
                // also register field so validation rules attach (we'll register again with rules on render)
            }
        });
    }, [schema, setValue]);

    // watch all fields for conditional rendering
    const watchedValues = watch();

    const shouldRenderField = (f: FieldSchema) => {
        if (f.hidden) return false;
        if (!f.dependsOn) return true;
        const val = (watchedValues as any)[f.dependsOn.field];
        return val === f.dependsOn.value;
    };

    const buildValidationRules = (field: FieldSchema) => {
        const validationRules: Record<string, any> = {};
        if (field.required) validationRules.required = `${field.label} is required`;
        if (field.validation?.pattern) {
            try {
                const regExp = new RegExp(field.validation.pattern);
                validationRules.pattern = {
                    value: regExp,
                    message: field.validation.message ?? `${field.label} is invalid`
                };
            } catch {
                // ignore invalid regex (same behavior as before)
                console.error("Invalid regex pattern for field:", field.name);
            }
        }
        if (field.validation?.minLength) validationRules.minLength = {
            value: field.validation.minLength,
            message: `${field.label} must be at least ${field.validation.minLength} characters`
        };
        if (field.validation?.maxLength) validationRules.maxLength = {
            value: field.validation.maxLength,
            message: `${field.label} must be at most ${field.validation.maxLength} characters`
        };
        return validationRules;
    };

    const renderField = (field: FieldSchema) => {
        if (!shouldRenderField(field)) return null;

        const validationRules = buildValidationRules(field);

        const commonProps = field.type !== "multiselect"
            ? { ...register(field.name, validationRules) }
            : undefined;

        const error = (errors as any)[field.name];

        switch (field.type) {
            case "text":
                return (
                    <div className="form-row" key={field.name}>
                        <label>{field.label}{field.required ? " *" : ""}</label>
                        <input
                            type="text"
                            {...(commonProps as any)}
                            placeholder={field.placeholder}
                            readOnly={field.readonly}
                            disabled={field.disabled}
                        />
                        {error && <div className="error">{error.message?.toString()}</div>}
                    </div>
                );
            case "textarea":
                return (
                    <div className="form-row" key={field.name}>
                        <label>{field.label}{field.required ? " *" : ""}</label>
                        <textarea
                            {...(commonProps as any)}
                            placeholder={field.placeholder}
                            readOnly={field.readonly}
                            disabled={field.disabled}
                        />
                        {error && <div className="error">{error.message?.toString()}</div>}
                    </div>
                );
            case "date":
                return (
                    <div className="form-row" key={field.name}>
                        <label>{field.label}{field.required ? " *" : ""}</label>
                        <input
                            type="date"
                            {...(commonProps as any)}
                            readOnly={field.readonly}
                            disabled={field.disabled}
                        />
                        {error && <div className="error">{error.message?.toString()}</div>}
                    </div>
                );
            case "dropdown":
                return (
                    <div className="form-row" key={field.name}>
                        <label>{field.label}{field.required ? " *" : ""}</label>
                        <select {...(commonProps as any)} defaultValue="">
                            <option value="" disabled>{field.placeholder ?? "Select..."}</option>
                            {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                        {error && <div className="error">{error.message?.toString()}</div>}
                    </div>
                );
            case "multiselect":
                // Register the field name with validation rules (but do not spread register props onto DOM) instead use value via setValue onChange
                register(field.name, validationRules);

                return (
                    <div className="form-row" key={field.name}>
                        <label>{field.label}{field.required ? " *" : ""}</label>
                        <select
                            multiple
                            onChange={(e) => {
                                const values = Array.from(e.target.selectedOptions).map(o => o.value);
                                // update RHF with array and trigger validation/dirty flags
                                setValue(field.name, values, { shouldValidate: true, shouldDirty: true });
                            }}
                            onBlur={() => {
                                // optional: trigger validation on blur by re-setting the value with current value
                                const current = (watch() as any)[field.name];
                                // if current is undefined, ensure it's an array (safe-guard)
                                setValue(field.name, Array.isArray(current) ? current : [], { shouldValidate: true, shouldDirty: false });
                            }}
                            disabled={field.disabled}
                        >
                            {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                        {error && <div className="error">{error.message?.toString()}</div>}
                    </div>
                );
            case "checkbox":
                return (
                    <div className="form-row" key={field.name}>
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                {...(commonProps as any)}
                            />
                            <span>{field.label}</span>
                        </label>
                        {error && <div className="error">{error.message?.toString()}</div>}
                    </div>
                );
            default:
                return null;
        }
    };

    const onSubmitInternal = (data: Record<string, any>) => {
        console.log("Form submitted:", data);
        if (onSubmit) onSubmit(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmitInternal)} className="dynamic-form">
            {schema.title && <h2>{schema.title}</h2>}
            <div className="fields">
                {schema.fields.map((field: any) => renderField(field))}
            </div>
            <div style={{ marginTop: 12 }}>
                <button type="submit">{submitLabel}</button>
            </div>
        </form>
    );
};
