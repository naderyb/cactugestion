"use client";

import { useState } from "react";
import { ChevronDown, Pencil, Trash2, Truck, Phone } from "lucide-react";
import type { OrderRow } from "@/lib/orders-queries";
import {
  CLIENT_NOTES,
  formatOrderNumber,
  type OrderStatus,
} from "@/lib/constants";
import { formatPhoneDisplay } from "@/lib/format";
import { StatusDropdown } from "@/components/ui/status-dropdown";
import styles from "./order-card.module.css";

export function OrderCard({
  order,
  onStatusChanged,
  onDeleted,
  onEdit,
  onDeleteRequest,
}: {
  order: OrderRow;
  onStatusChanged: () => void;
  onDeleted: () => void;
  onEdit: (order: OrderRow) => void;
  onDeleteRequest: (order: OrderRow) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [updating, setUpdating] = useState(false);

  const itemsTotal = order.items.reduce(
    (sum, item) => sum + item.quantity * Number(item.unitPrice),
    0,
  );
  const total = itemsTotal + Number(order.delivery_price ?? 0);
  const noteLabel = CLIENT_NOTES.find(
    (c) => c.value === order.client_note,
  )?.label;
  async function handleStatusChange(newStatus: OrderStatus) {
    setUpdating(true);
    await fetch(`/api/orders/${order.id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    setUpdating(false);
    onStatusChanged();
  }

  return (
    <div className={`${styles.card} ${expanded ? styles.cardExpanded : ""}`}>
      <div className={styles.summary} onClick={() => setExpanded((v) => !v)}>
        <div className={styles.summaryLeft}>
          <span className={styles.orderNumber}>
            {formatOrderNumber(order.order_number)}
          </span>
          <div className={styles.customerMeta}>
            <span className={styles.clientName}>{order.client_full_name}</span>
            <span className={styles.customerDetail}>
              {formatPhoneDisplay(order.client_phone)}
            </span>
          </div>
        </div>
        <div className={styles.summaryRight}>
          <span className={styles.total}>
            {total.toLocaleString("fr-FR")} DA
          </span>
          <StatusDropdown
            value={order.status as OrderStatus}
            onChange={handleStatusChange}
            disabled={updating}
            onOpen={() => setExpanded(true)}
          />
          <ChevronDown
            className={`${styles.chevron} ${expanded ? styles.chevronOpen : ""}`}
            size={18}
          />
        </div>
      </div>

      {expanded && (
        <div className={styles.details}>
          <div className={styles.detailBox}>
            <div className={styles.detailHeader}>Détails commande</div>

            <div className={styles.detailGrid}>
              <div className={styles.detailRow}>
                <span className={styles.label}>Commune</span>
                <span className={styles.value}>{order.commune}</span>
              </div>

              <div className={styles.detailRow}>
                <span className={styles.label}>Wilaya</span>
                <span className={styles.value}>{order.wilaya}</span>
              </div>

              <div className={styles.detailRow}>
                <span className={styles.label}>Livraison</span>
                <div className={styles.deliveryMeta}>
                  <span className={styles.value}>
                    {order.delivery_type === "bureau" ? "Bureau" : "Domicile"}
                  </span>
                  <span className={styles.noteTag}>{noteLabel}</span>
                </div>
              </div>

              <div className={styles.detailRow}>
                <span className={styles.label}>Client</span>
                <div className={styles.clientMeta}>
                  <span className={styles.infoItem}>
                    <Phone size={14} />
                    <span>{formatPhoneDisplay(order.client_phone)}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <ul className={styles.itemsList}>
            {order.items.map((item) => (
              <li key={item.id}>
                <span>
                  {item.productName} × {item.quantity}
                </span>
                <span>
                  {(item.quantity * Number(item.unitPrice)).toLocaleString(
                    "fr-FR",
                  )}{" "}
                  DA
                </span>
              </li>
            ))}
            <li className={styles.deliveryLine}>
              <span>Livraison</span>
              <span>
                {Number(order.delivery_price ?? 0).toLocaleString("fr-FR")} DA
              </span>
            </li>
          </ul>

          <div className={styles.footer}>
            <span className={styles.createdBy}>
              Créée par {order.created_by_name ?? "-"}
            </span>
            <div className={styles.actions}>
              <button
                className={styles.editButton}
                onClick={() => onEdit(order)}
              >
                <Pencil size={14} /> Modifier
              </button>
              <button
                className={styles.deleteButton}
                onClick={() => onDeleteRequest(order)}
              >
                <Trash2 size={14} /> Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
