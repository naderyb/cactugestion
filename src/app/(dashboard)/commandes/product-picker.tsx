"use client";

import { PRODUCTS } from "@/lib/constants";
import styles from "./product-picker.module.css";

interface ItemLike {
  productName: string;
  quantity: string;
}

export function ProductPicker({
  items,
  onPick,
}: {
  items: ItemLike[];
  onPick: (product: { name: string; price: number }) => void;
}) {
  return (
    <div className={styles.wrapper}>
      <p className={styles.hint}>
        Clique sur un produit pour l'ajouter à la commande
      </p>
      <div className={styles.grid}>
        {PRODUCTS.map((product) => {
          const inCart = items.find((it) => it.productName === product.name);
          const quantity = inCart ? Number(inCart.quantity) || 0 : 0;
          const selected = quantity > 0;

          return (
            <button
              key={product.name}
              type="button"
              className={`${styles.chip} ${selected ? styles.chipSelected : ""}`}
              onClick={() => onPick(product)}
            >
              {selected && <span className={styles.chipBadge}>{quantity}</span>}
              <span className={styles.chipName}>{product.name}</span>
              <span className={styles.chipPrice}>
                {product.price.toLocaleString("fr-FR")} DA
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
