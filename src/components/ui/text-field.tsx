"use client";

import { InputHTMLAttributes, forwardRef, useId } from "react";
import styles from "./text-field.module.css";

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
  helperTone?: "neutral" | "warning";
  hideSuccessIndicator?: boolean;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      label,
      error,
      helperText,
      helperTone = "neutral",
      hideSuccessIndicator,
      id,
      value,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const stringValue = value == null ? "" : String(value);
    const showSuccess =
      !hideSuccessIndicator && Boolean(stringValue.trim()) && !error;
    const emptyRequired = Boolean(props.required && !stringValue.trim());

    return (
      <div
        className={`${styles.field} ${emptyRequired ? styles.requiredField : ""}`}
      >
        <div className={styles.labelRow}>
          <label htmlFor={inputId} className={styles.label}>
            {label}
          </label>
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
            aria-describedby={
              error
                ? `${inputId}-error`
                : helperText
                  ? `${inputId}-helper`
                  : undefined
            }
            value={value}
            {...props}
          />
        </div>

        {helperText && !error && (
          <p
            id={`${inputId}-helper`}
            className={`${styles.helperText} ${
              helperTone === "warning" ? styles.helperTextWarning : ""
            }`}
          >
            {helperText}
          </p>
        )}

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
