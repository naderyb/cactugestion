"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { ORDER_STATUSES, type OrderStatus } from "@/lib/constants";
import styles from "./status-dropdown.module.css";

export function StatusDropdown({
  value,
  onChange,
  disabled,
  onOpen,
}: {
  value: OrderStatus;
  onChange: (status: OrderStatus) => void;
  disabled?: boolean;
  onOpen?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current =
    ORDER_STATUSES.find((s) => s.value === value) ?? ORDER_STATUSES[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node))
        setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className={styles.wrapper}
      ref={ref}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        className={styles.trigger}
        style={{ background: current.color }}
        onClick={() => {
          if (disabled) return;
          onOpen?.();
          setOpen((v) => !v);
        }}
        disabled={disabled}
      >
        {current.label}
        <ChevronDown size={14} />
      </button>
      {open && (
        <div className={styles.menu}>
          {ORDER_STATUSES.map((s) => (
            <button
              key={s.value}
              type="button"
              className={styles.menuItem}
              onClick={() => {
                onOpen?.();
                onChange(s.value);
                setOpen(false);
              }}
            >
              <span className={styles.dot} style={{ background: s.color }} />
              {s.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
