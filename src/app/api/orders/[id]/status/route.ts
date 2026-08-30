import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { getCurrentUser } from "@/lib/current-user";
import { updateStatusSchema } from "@/lib/validation";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getCurrentUser();
  if (!user)
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = updateStatusSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Statut invalide." }, { status: 400 });
  }

  const updated = await sql`
    UPDATE orders
    SET status = ${parsed.data.status}, updated_by = ${user.id}, updated_at = now()
    WHERE id = ${id}
    RETURNING id
  `;

  if (!updated[0]) {
    return NextResponse.json(
      { error: "Commande introuvable." },
      { status: 404 },
    );
  }

  return NextResponse.json({ success: true });
}
