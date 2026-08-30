"use client";

import { ButtonHTMLAttributes } from "react";
import styles from "./submit-button.module.css";

interface SubmitButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
}

export function SubmitButton({
  loading,
  children,
  disabled,
  ...props
}: SubmitButtonProps) {
  return (
    <button className={styles.button} disabled={disabled || loading} {...props}>
      {loading ? <span className={styles.spinner} aria-hidden /> : children}
    </button>
  );
}
