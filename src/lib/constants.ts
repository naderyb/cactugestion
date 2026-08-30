export const WILAYAS = [
  "Adrar",
  "Chlef",
  "Laghouat",
  "Oum El Bouaghi",
  "Batna",
  "Béjaïa",
  "Biskra",
  "Béchar",
  "Blida",
  "Bouira",
  "Tamanrasset",
  "Tébessa",
  "Tlemcen",
  "Tiaret",
  "Tizi Ouzou",
  "Alger",
  "Djelfa",
  "Jijel",
  "Sétif",
  "Saïda",
  "Skikda",
  "Sidi Bel Abbès",
  "Annaba",
  "Guelma",
  "Constantine",
  "Médéa",
  "Mostaganem",
  "M'Sila",
  "Mascara",
  "Ouargla",
  "Oran",
  "El Bayadh",
  "Illizi",
  "Bordj Bou Arréridj",
  "Boumerdès",
  "El Tarf",
  "Tindouf",
  "Tissemsilt",
  "El Oued",
  "Khenchela",
  "Souk Ahras",
  "Tipaza",
  "Mila",
  "Aïn Defla",
  "Naâma",
  "Aïn Témouchent",
  "Ghardaïa",
  "Relizane",
  "Timimoun",
  "Bordj Badji Mokhtar",
  "Ouled Djellal",
  "Béni Abbès",
  "In Salah",
  "In Guezzam",
  "Touggourt",
  "Djanet",
  "El M'Ghair",
  "El Meniaa",
] as const;

export const ORDER_STATUSES = [
  { value: "vu", label: "Vu", color: "var(--peche)" },
  { value: "prepare", label: "Préparé", color: "var(--cactus-40)" },
  { value: "livre", label: "Livré", color: "var(--vert-cactus)" },
  { value: "annule", label: "Annulé", color: "#e8e8e8" },
  { value: "retourne", label: "Retourné", color: "var(--violet-15)" },
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number]["value"];

export const CLIENT_NOTES = [
  { value: "nouveau", label: "Nouveau" },
  { value: "habituel", label: "Habituel" },
  { value: "fidele", label: "Fidèle" },
] as const;

export type ClientNote = (typeof CLIENT_NOTES)[number]["value"];

export const DELIVERY_TYPES = [
  { value: "bureau", label: "Bureau" },
  { value: "domicile", label: "Domicile" },
] as const;

export type DeliveryType = (typeof DELIVERY_TYPES)[number]["value"];

export function formatOrderNumber(n: number): string {
  return `CACT-${String(n).padStart(4, "0")}`;
}
