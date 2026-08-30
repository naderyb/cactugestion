"use client";

import { Inbox, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { OrderRow } from "@/lib/orders-queries";
import { ORDER_STATUSES } from "@/lib/constants";
import { OrderCard } from "./order-card";
import styles from "./order-list.module.css";

export function OrderList({
  orders,
  loading,
  onStatusChanged,
  onDeleted,
  onEdit,
  onCreateNew,
  onDeleteRequest,
}: {
  orders: OrderRow[];
  loading: boolean;
  onStatusChanged: () => void;
  onDeleted: () => void;
  onEdit: (order: OrderRow) => void;
  onCreateNew: () => void;
  onDeleteRequest: (order: OrderRow) => void;
}) {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  const filtered = useMemo(() => {
    return orders.filter((order) => {
      const matchesStatus =
        statusFilter === "all" || order.status === statusFilter;
      const term = search.trim().toLowerCase();
      const matchesSearch =
        !term ||
        order.client_full_name.toLowerCase().includes(term) ||
        order.client_phone.includes(term) ||
        String(order.order_number).includes(term);
      return matchesStatus && matchesSearch;
    });
  }, [orders, statusFilter, search]);

  useEffect(() => {
    setPage(1);
  }, [statusFilter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const paginatedOrders = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const handlePageChange = (nextPage: number) => {
    setPage(Math.min(Math.max(nextPage, 1), totalPages));
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.filters}>
        <input
          className={styles.searchInput}
          placeholder="Rechercher (nom, téléphone, n° commande)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className={styles.statusTabs}>
          <button
            className={`${styles.tab} ${statusFilter === "all" ? styles.tabActive : ""}`}
            onClick={() => setStatusFilter("all")}
          >
            Toutes
          </button>
          {ORDER_STATUSES.map((s) => (
            <button
              key={s.value}
              className={`${styles.tab} ${statusFilter === s.value ? styles.tabActive : ""}`}
              onClick={() => setStatusFilter(s.value)}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className={styles.skeletonGrid} aria-live="polite">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className={styles.skeletonCard} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIconWrap}>
            <Inbox size={28} />
          </div>
          <h3>Aucune commande correspondante</h3>
          <p>
            {search || statusFilter !== "all"
              ? "Essayez de modifier les filtres pour retrouver une commande."
              : "Commencez par créer votre première commande."}
          </p>
          <button
            type="button"
            className={styles.emptyButton}
            onClick={onCreateNew}
          >
            <Plus size={16} />
            Nouvelle commande
          </button>
        </div>
      ) : (
        <>
          <div className={styles.cards}>
            {paginatedOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onStatusChanged={onStatusChanged}
                onDeleted={onDeleted}
                onEdit={onEdit}
                onDeleteRequest={onDeleteRequest}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                type="button"
                className={styles.pageButton}
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Précédent
              </button>

              <span className={styles.pageInfo}>
                Page {currentPage} / {totalPages}
              </span>

              <button
                type="button"
                className={styles.pageButton}
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Suivant
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
