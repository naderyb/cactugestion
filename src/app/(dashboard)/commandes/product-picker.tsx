"use client";

import { PRODUCTS } from "@/lib/constants";
import styles from "./product-picker.module.css";

export function ProductPicker({
  onPick,
}: {
  onPick: (product: { name: string; price: number }) => void;
}) {
  return (
    <div className={styles.wrapper}>
      <p className={styles.hint}>
        Clique sur un produit pour l'ajouter à la commande
      </p>
      <div className={styles.grid}>
        {PRODUCTS.map((product) => (
          <button
            key={product.name}
            type="button"
            className={styles.chip}
            onClick={() => onPick(product)}
          >
            <span className={styles.chipName}>{product.name}</span>
            <span className={styles.chipPrice}>
              {product.price.toLocaleString("fr-FR")} DA
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
