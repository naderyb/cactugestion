"use client";

import { InputHTMLAttributes, forwardRef, useId } from "react";
import styles from "./text-field.module.css";

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, error, helperText, id, value, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const stringValue = value == null ? "" : String(value);
    const showSuccess = Boolean(stringValue.trim()) && !error;
    const emptyRequired = Boolean(props.required && !stringValue.trim());

    return (
      <div
        className={`${styles.field} ${emptyRequired ? styles.requiredField : ""}`}
      >
        <div className={styles.labelRow}>
          <label htmlFor={inputId} className={styles.label}>
            {label}
          </label>
          {helperText && (
            <span className={styles.helperText}>{helperText}</span>
          )}
          {showSuccess && <span className={styles.successPill}>✓</span>}
        </div>
        <div className={styles.inputWrap}>
          <input
            ref={ref}
            id={inputId}
            className={`${styles.input} ${error ? styles.inputError : ""} ${
              showSuccess ? styles.inputSuccess : ""
            }`}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${inputId}-error` : undefined}
            value={value}
            {...props}
          />
        </div>
        {error && (
          <p id={`${inputId}-error`} className={styles.errorText} role="alert">
            {error}
          </p>
        )}
      </div>
    );
  },
);

TextField.displayName = "TextField";
