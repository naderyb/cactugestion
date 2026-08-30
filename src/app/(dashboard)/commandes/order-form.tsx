"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { TextField } from "@/components/ui/text-field";
import { SubmitButton } from "@/components/ui/submit-button";
import { WILAYAS, CLIENT_NOTES, DELIVERY_TYPES } from "@/lib/constants";
import { formatPhoneDisplay } from "@/lib/format";
import type { OrderRow } from "@/lib/orders-queries";
import styles from "./order-form.module.css";

function CustomSelect({
  label,
  value,
  options,
  onChange,
  error,
  required,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const current =
    options.find((option) => option.value === value) ?? options[0];
  const showSuccess = Boolean(value.trim()) && !error;
  const emptyRequired = Boolean(required && !value.trim());

  return (
    <div className={styles.customSelect} ref={ref}>
      <div className={styles.selectHeader}>
        <label className={styles.selectLabel}>{label}</label>
        {showSuccess && <span className={styles.successChip}>✓</span>}
      </div>
      <button
        type="button"
        className={`${styles.selectTrigger} ${open ? styles.selectTriggerOpen : ""} ${
          emptyRequired ? styles.selectTriggerRequired : ""
        } ${error ? styles.selectTriggerError : ""}`}
        onClick={() => setOpen((v) => !v)}
      >
        <span>{current?.label ?? value}</span>
        <span className={styles.selectChevron}>▾</span>
      </button>

      {error && <p className={styles.inlineError}>{error}</p>}

      {open && (
        <div className={styles.selectMenu} role="listbox" aria-label={label}>
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`${styles.selectOption} ${
                option.value === value ? styles.selectOptionSelected : ""
              }`}
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

interface ItemDraft {
  productName: string;
  quantity: string;
  unitPrice: string;
}

const emptyItem: ItemDraft = { productName: "", quantity: "1", unitPrice: "" };

export function OrderForm({
  mode,
  initialOrder,
  onSaved,
  onCancel,
}: {
  mode: "create" | "edit";
  initialOrder?: OrderRow;
  onSaved: (message?: string) => void;
  onCancel?: () => void;
}) {
  const [clientFullName, setClientFullName] = useState(
    initialOrder?.client_full_name ?? "",
  );
  const [clientPhone, setClientPhone] = useState(
    initialOrder?.client_phone ?? "",
  );
  const [wilaya, setWilaya] = useState(initialOrder?.wilaya ?? WILAYAS[0]);
  const [commune, setCommune] = useState(initialOrder?.commune ?? "");
  const [deliveryType, setDeliveryType] = useState<"bureau" | "domicile">(
    (initialOrder?.delivery_type as "bureau" | "domicile") ?? "bureau",
  );
  const [clientNote, setClientNote] = useState<
    "nouveau" | "habituel" | "fidele"
  >(
    (initialOrder?.client_note as "nouveau" | "habituel" | "fidele") ??
      "nouveau",
  );
  const [deliveryPrice, setDeliveryPrice] = useState(
    initialOrder ? String(initialOrder.delivery_price ?? "0") : "0",
  );
  const [items, setItems] = useState<ItemDraft[]>(
    initialOrder && initialOrder.items.length > 0
      ? initialOrder.items.map((it) => ({
          productName: it.productName,
          quantity: String(it.quantity),
          unitPrice: String(it.unitPrice),
        }))
      : [{ ...emptyItem }],
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const subtotal = items.reduce((sum, item) => {
    const quantity = Number(item.quantity) || 0;
    const price = Number(item.unitPrice) || 0;
    return sum + quantity * price;
  }, 0);
  const deliveryFee = Number(deliveryPrice) || 0;
  const liveTotal = subtotal + deliveryFee;

  function updateItem(index: number, field: keyof ItemDraft, value: string) {
    setItems((prev) =>
      prev.map((it, i) => (i === index ? { ...it, [field]: value } : it)),
    );
  }

  function addItem() {
    setItems((prev) => [...prev, { ...emptyItem }]);
  }

  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  function handlePhoneChange(event: React.ChangeEvent<HTMLInputElement>) {
    const digits = event.target.value.replace(/\D/g, "").slice(0, 10);
    setClientPhone(digits);
  }

  function validateForm() {
    const nextErrors: Record<string, string> = {};

    if (!clientFullName.trim()) {
      nextErrors.clientFullName = "Le nom du client est requis.";
    }

    if (!clientPhone.trim()) {
      nextErrors.clientPhone = "Le numéro de téléphone est requis.";
    } else if (clientPhone.length !== 10) {
      nextErrors.clientPhone = "Le numéro doit contenir 10 chiffres.";
    }

    if (!commune.trim()) {
      nextErrors.commune = "La commune est requise.";
    }

    items.forEach((item, index) => {
      if (!item.productName.trim()) {
        nextErrors[`itemProduct-${index}`] = "Nom du produit requis.";
      }
      if (!item.quantity.trim() || Number(item.quantity) <= 0) {
        nextErrors[`itemQuantity-${index}`] = "Quantité invalide.";
      }
      if (!item.unitPrice.trim() || Number(item.unitPrice) <= 0) {
        nextErrors[`itemUnitPrice-${index}`] = "Prix invalide.";
      }
    });

    if (items.length === 0) {
      nextErrors.items = "Ajoutez au moins un produit.";
    }

    return nextErrors;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    const validation = validateForm();
    setFormErrors(validation);

    if (Object.keys(validation).length > 0) {
      return;
    }

    setLoading(true);

    const payload = {
      clientFullName,
      clientPhone,
      wilaya,
      commune,
      deliveryType,
      clientNote,
      deliveryPrice: Number(deliveryPrice || 0),
      items: items.map((it) => ({
        productName: it.productName,
        quantity: Number(it.quantity),
        unitPrice: Number(it.unitPrice),
      })),
    };

    try {
      const url =
        mode === "edit" ? `/api/orders/${initialOrder!.id}` : "/api/orders";
      const method = mode === "edit" ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Erreur lors de l'enregistrement.");
        return;
      }

      onSaved(
        mode === "edit"
          ? "Commande mise à jour avec succès."
          : "Commande enregistrée avec succès.",
      );
    } catch {
      setError("Impossible de contacter le serveur.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.sectionCard}>
        <div className={styles.sectionHeader}>Informations client</div>
        <div className={styles.grid}>
          <TextField
            label="Nom complet du client"
            value={clientFullName}
            onChange={(e) => setClientFullName(e.target.value)}
            required
            error={formErrors.clientFullName}
          />
          <TextField
            label="Numéro de téléphone"
            placeholder="05 51 23 45 67"
            value={formatPhoneDisplay(clientPhone)}
            onChange={handlePhoneChange}
            required
            error={formErrors.clientPhone}
          />
        </div>
      </div>

      <div className={styles.sectionCard}>
        <div className={styles.sectionHeader}>Détails commande</div>
        <div className={styles.grid}>
          <TextField
            label="Commune"
            value={commune}
            onChange={(e) => setCommune(e.target.value)}
            required
            error={formErrors.commune}
          />

          <CustomSelect
            label="Wilaya"
            value={wilaya}
            options={WILAYAS.map((w) => ({ value: w, label: w }))}
            onChange={setWilaya}
          />

          <CustomSelect
            label="Livraison"
            value={deliveryType}
            options={DELIVERY_TYPES.map((d) => ({
              value: d.value,
              label: d.label,
            }))}
            onChange={(value) =>
              setDeliveryType(value as "bureau" | "domicile")
            }
          />

          <CustomSelect
            label="Note du client"
            value={clientNote}
            options={CLIENT_NOTES.map((c) => ({
              value: c.value,
              label: c.label,
            }))}
            onChange={(value) =>
              setClientNote(value as "nouveau" | "habituel" | "fidele")
            }
          />
        </div>
      </div>

      <div className={styles.sectionCard}>
        <div className={styles.sectionHeader}>Livraison</div>
        <div className={styles.grid}>
          <TextField
            label="Prix de la livraison (DA)"
            helperText="Optionnel — ajouté au total"
            type="number"
            min={0}
            step="0.01"
            value={deliveryPrice}
            onChange={(e) => setDeliveryPrice(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.itemsSection}>
        <div className={styles.itemsHeader}>
          <h3>Produits</h3>
          <button
            type="button"
            className={styles.addItemButton}
            onClick={addItem}
          >
            + Ajouter un produit
          </button>
        </div>

        {items.map((item, index) => (
          <div key={index} className={styles.itemRow}>
            <div className={styles.fieldGroup}>
              <input
                className={`${styles.itemInput} ${
                  formErrors[`itemProduct-${index}`]
                    ? styles.itemInputError
                    : ""
                }`}
                placeholder="Nom du produit"
                value={item.productName}
                onChange={(e) =>
                  updateItem(index, "productName", e.target.value)
                }
                required
              />
              {formErrors[`itemProduct-${index}`] && (
                <span className={styles.inlineError}>
                  {formErrors[`itemProduct-${index}`]}
                </span>
              )}
            </div>
            <div className={styles.fieldGroup}>
              <input
                className={`${styles.itemInputSmall} ${
                  formErrors[`itemQuantity-${index}`]
                    ? styles.itemInputError
                    : ""
                }`}
                type="number"
                min={1}
                placeholder="Qté"
                value={item.quantity}
                onChange={(e) => updateItem(index, "quantity", e.target.value)}
                required
              />
              {formErrors[`itemQuantity-${index}`] && (
                <span className={styles.inlineError}>
                  {formErrors[`itemQuantity-${index}`]}
                </span>
              )}
            </div>
            <div className={styles.fieldGroup}>
              <input
                className={`${styles.itemInputSmall} ${
                  formErrors[`itemUnitPrice-${index}`]
                    ? styles.itemInputError
                    : ""
                }`}
                type="number"
                min={0}
                step="0.01"
                placeholder="Prix (DA)"
                value={item.unitPrice}
                onChange={(e) => updateItem(index, "unitPrice", e.target.value)}
                required
              />
              {formErrors[`itemUnitPrice-${index}`] && (
                <span className={styles.inlineError}>
                  {formErrors[`itemUnitPrice-${index}`]}
                </span>
              )}
            </div>
            {items.length > 1 && (
              <button
                type="button"
                className={styles.removeButton}
                onClick={() => removeItem(index)}
                aria-label="Retirer ce produit"
              >
                ×
              </button>
            )}
          </div>
        ))}

        <div className={styles.totalSummary}>
          <div className={styles.totalSummaryRow}>
            <span>Sous-total</span>
            <strong>{subtotal.toLocaleString("fr-FR")} DA</strong>
          </div>
          <div className={styles.totalSummaryRow}>
            <span>Livraison</span>
            <strong>{deliveryFee.toLocaleString("fr-FR")} DA</strong>
          </div>
          <div
            className={`${styles.totalSummaryRow} ${styles.totalSummaryRowFinal}`}
          >
            <span>Total</span>
            <strong>{liveTotal.toLocaleString("fr-FR")} DA</strong>
          </div>
        </div>
      </div>

      <div className={styles.formActions}>
        {onCancel && (
          <button
            type="button"
            className={styles.cancelButton}
            onClick={onCancel}
          >
            Annuler
          </button>
        )}
        <SubmitButton type="submit" loading={loading}>
          {mode === "edit"
            ? "Enregistrer les modifications"
            : "Enregistrer la commande"}
        </SubmitButton>
      </div>
    </form>
  );
}
