import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().trim().min(1, "Nom d'utilisateur requis").max(100),
  password: z.string().min(1, "Mot de passe requis").max(200),
});

export const setupAccountSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(3, "Le nom complet doit faire au moins 3 caractères")
      .max(80, "Le nom complet est trop long")
      .regex(/^[a-zA-ZÀ-ÿ' -]+$/, "Caractères non autorisés dans le nom"),
    password: z
      .string()
      .min(8, "Le mot de passe doit faire au moins 8 caractères")
      .max(200),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type SetupAccountInput = z.infer<typeof setupAccountSchema>;

const orderItemSchema = z.object({
  productName: z.string().trim().min(1, "Nom du produit requis").max(120),
  quantity: z.coerce.number().int().min(1, "Quantité invalide").max(9999),
  unitPrice: z.coerce.number().min(0, "Prix invalide").max(1_000_000),
});

export const createOrderSchema = z.object({
  clientFullName: z.string().trim().min(2, "Nom du client requis").max(120),
  clientPhone: z
    .string()
    .trim()
    .regex(/^0[5-7][0-9]{8}$/, "Numéro invalide (ex: 0551234567)"),
  wilaya: z.string().trim().min(1, "Wilaya requise"),
  commune: z.string().trim().min(1, "Commune requise").max(100),
  deliveryType: z.enum(["bureau", "domicile"]),
  clientNote: z.enum(["nouveau", "habituel", "fidele"]),
  deliveryPrice: z.coerce
    .number()
    .min(0, "Prix invalide")
    .max(1_000_000)
    .default(0),
  totalOverride: z
    .union([
      z.coerce.number().min(0, "Total invalide").max(10_000_000),
      z.null(),
    ])
    .default(null),
  items: z.array(orderItemSchema).min(1, "Ajoute au moins un produit"),
});

export const updateStatusSchema = z.object({
  status: z.enum(["vu", "prepare", "livre", "annule", "retourne"]),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;