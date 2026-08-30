import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { getCurrentUser } from "@/lib/current-user";
import { getAllOrders } from "@/lib/orders-queries";
import { createOrderSchema } from "@/lib/validation";

export async function GET() {
  const user = await getCurrentUser();
  if (!user)
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });

  const orders = await getAllOrders();
  return NextResponse.json({ orders });
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user)
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });

  const body = await request.json().catch(() => null);
  const parsed = createOrderSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Champs invalides." },
      { status: 400 },
    );
  }

  const {
    clientFullName,
    clientPhone,
    wilaya,
    commune,
    deliveryType,
    clientNote,
    deliveryPrice,
    items,
  } = parsed.data;

  const created = await sql`
    INSERT INTO orders (
      client_full_name, client_phone, wilaya, commune,
      delivery_type, client_note, delivery_price, created_by, updated_by
    )
    VALUES (
      ${clientFullName}, ${clientPhone}, ${wilaya}, ${commune},
      ${deliveryType}, ${clientNote}, ${deliveryPrice}, ${user.id}, ${user.id}
    )
    RETURNING id, order_number
  `;

  const order = created[0];
  if (!order) {
    return NextResponse.json(
      { error: "Échec de la création." },
      { status: 500 },
    );
  }

  for (const item of items) {
    await sql`
      INSERT INTO order_items (order_id, product_name, quantity, unit_price)
      VALUES (${order.id}, ${item.productName}, ${item.quantity}, ${item.unitPrice})
    `;
  }

  return NextResponse.json(
    { id: order.id, orderNumber: order.order_number },
    { status: 201 },
  );
}
