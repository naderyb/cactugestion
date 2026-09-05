import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { getCurrentUser } from "@/lib/current-user";
import { createOrderSchema } from "@/lib/validation";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getCurrentUser();
  if (!user)
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });

  const { id } = await params;
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
    totalOverride,
    items,
  } = parsed.data;

  const updated = await sql`
    UPDATE orders SET
      client_full_name = ${clientFullName},
      client_phone = ${clientPhone},
      wilaya = ${wilaya},
      commune = ${commune},
      delivery_type = ${deliveryType},
      client_note = ${clientNote},
      delivery_price = ${deliveryPrice},
      total_override = ${totalOverride},
      updated_by = ${user.id},
      updated_at = now()
    WHERE id = ${id}
    RETURNING id
  `;

  if (!updated[0]) {
    return NextResponse.json(
      { error: "Commande introuvable." },
      { status: 404 },
    );
  }

  await sql`DELETE FROM order_items WHERE order_id = ${id}`;
  for (const item of items) {
    await sql`
      INSERT INTO order_items (order_id, product_name, quantity, unit_price)
      VALUES (${id}, ${item.productName}, ${item.quantity}, ${item.unitPrice})
    `;
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getCurrentUser();
  if (!user)
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });

  const { id } = await params;

  // order_items est supprimé automatiquement via ON DELETE CASCADE
  const deleted = await sql`DELETE FROM orders WHERE id = ${id} RETURNING id`;

  if (!deleted[0]) {
    return NextResponse.json(
      { error: "Commande introuvable." },
      { status: 404 },
    );
  }

  return NextResponse.json({ success: true });
}
