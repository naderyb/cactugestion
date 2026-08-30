import { sql } from "@/lib/db";

export interface OrderItemRow {
  id: string;
  productName: string;
  quantity: number;
  unitPrice: string;
}

export interface OrderRow {
  id: string;
  order_number: number;
  client_full_name: string;
  client_phone: string;
  wilaya: string;
  commune: string;
  delivery_type: string;
  client_note: string;
  status: string;
  delivery_price: string;
  created_at: string;
  created_by_name: string | null;
  items: OrderItemRow[];
}

export async function getAllOrders(): Promise<OrderRow[]> {
  const rows = await sql`
    SELECT
      o.id,
      o.order_number,
      o.client_full_name,
      o.client_phone,
      o.wilaya,
      o.commune,
      o.delivery_type,
      o.client_note,
      o.status,
      o.delivery_price,
      o.created_at,
      u.full_name AS created_by_name,
      COALESCE(
        json_agg(
          json_build_object(
            'id', oi.id,
            'productName', oi.product_name,
            'quantity', oi.quantity,
            'unitPrice', oi.unit_price
          )
        ) FILTER (WHERE oi.id IS NOT NULL),
        '[]'
      ) AS items
    FROM orders o
    LEFT JOIN order_items oi ON oi.order_id = o.id
    LEFT JOIN users u ON u.id = o.created_by
    GROUP BY o.id, u.full_name
    ORDER BY o.created_at DESC
    LIMIT 1000
  `;

  return rows as unknown as OrderRow[];
}
