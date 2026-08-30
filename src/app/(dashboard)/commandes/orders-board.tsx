"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { OrderRow } from "@/lib/orders-queries";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { formatOrderNumber } from "@/lib/constants";
import { OrderForm } from "./order-form";
import { OrderList } from "./order-list";
import styles from "./orders-board.module.css";

export function OrdersBoard() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeForm, setActiveForm] = useState<"create" | "edit" | null>(null);
  const [editingOrder, setEditingOrder] = useState<OrderRow | null>(null);
  const [closingForm, setClosingForm] = useState(false);
  const [pendingDeleteOrder, setPendingDeleteOrder] = useState<OrderRow | null>(
    null,
  );
  const [deletingOrderId, setDeletingOrderId] = useState<string | null>(null);
  const formRef = useRef<HTMLDivElement | null>(null);
  const [toast, setToast] = useState<{ text: string; type: "success" } | null>(
    null,
  );

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/orders");
    const data = await res.json();
    setOrders(data.orders ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  function openCreateForm() {
    setClosingForm(false);
    setEditingOrder(null);
    setActiveForm("create");
    window.requestAnimationFrame(() => {
      formRef.current?.scrollIntoView({ behavior: "auto", block: "start" });
      window.scrollTo({ top: 0, behavior: "auto" });
    });
  }

  function openEditForm(order: OrderRow) {
    setClosingForm(false);
    setEditingOrder(order);
    setActiveForm("edit");
    window.requestAnimationFrame(() => {
      formRef.current?.scrollIntoView({ behavior: "auto", block: "start" });
      window.scrollTo({ top: 0, behavior: "auto" });
    });
  }

  function closeForms() {
    setClosingForm(true);
    window.setTimeout(() => {
      setActiveForm(null);
      setEditingOrder(null);
      setClosingForm(false);
    }, 220);
  }

  function showToast(text: string) {
    setToast({ text, type: "success" });
  }

  async function confirmDelete() {
    if (!pendingDeleteOrder) return;

    setDeletingOrderId(pendingDeleteOrder.id);
    await fetch(`/api/orders/${pendingDeleteOrder.id}`, { method: "DELETE" });
    setDeletingOrderId(null);
    setPendingDeleteOrder(null);
    showToast("Commande supprimée avec succès.");
    fetchOrders();
  }

  return (
    <div className={styles.board}>
      {toast && (
        <div className={styles.toast} role="status" aria-live="polite">
          <span className={styles.toastCheck}>✓</span>
          <span>{toast.text}</span>
        </div>
      )}

      <div className={styles.topBar}>
        <div>
          <h1>Commandes</h1>
          <p className={styles.subtitle}>
            Gère les commandes entrantes et sortantes
          </p>
        </div>
        <button
          className={styles.newOrderButton}
          onClick={() => {
            if (activeForm) {
              closeForms();
              return;
            }
            openCreateForm();
          }}
        >
          {activeForm ? "Fermer" : "+ Nouvelle commande"}
        </button>
      </div>

      {activeForm && (
        <div
          ref={formRef}
          className={`${styles.formWrapper} ${closingForm ? styles.formWrapperClosing : styles.formWrapperOpening}`}
        >
          {activeForm === "create" ? (
            <OrderForm
              mode="create"
              onSaved={(message) => {
                showToast(message ?? "Commande enregistrée avec succès.");
                closeForms();
                fetchOrders();
              }}
              onCancel={closeForms}
            />
          ) : (
            <OrderForm
              mode="edit"
              initialOrder={editingOrder ?? undefined}
              onSaved={(message) => {
                showToast(message ?? "Commande mise à jour avec succès.");
                closeForms();
                fetchOrders();
              }}
              onCancel={closeForms}
            />
          )}
        </div>
      )}

      <div className={styles.listSection}>
        <OrderList
          orders={orders}
          loading={loading}
          onStatusChanged={fetchOrders}
          onDeleted={fetchOrders}
          onEdit={openEditForm}
          onCreateNew={openCreateForm}
          onDeleteRequest={(order) => setPendingDeleteOrder(order)}
        />
      </div>

      <ConfirmDialog
        open={!!pendingDeleteOrder}
        title="Supprimer cette commande ?"
        message={`Cette action est irréversible.`}
        confirmLabel={
          deletingOrderId === (pendingDeleteOrder?.id ?? null)
            ? "Suppression..."
            : "Supprimer"
        }
        danger
        onConfirm={confirmDelete}
        onCancel={() => setPendingDeleteOrder(null)}
      />
    </div>
  );
}
