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

export interface Product {
  name: string;
  price: number;
}

export const PRODUCTS: Product[] = [
  { name: "Shampoing liquide", price: 1100 },
  { name: "Shampoing solide", price: 1100 },
  { name: "Sérum cheveux", price: 950 },
  { name: "Soin capillaire", price: 1500 },
  { name: "Masque cheveux", price: 1750 },
  { name: "Savon cactus", price: 850 },
  { name: "Savon romarin", price: 850 },
  { name: "Savon Nila", price: 700 },
  { name: "Savon Argile", price: 700 },
  { name: "Savon de douche", price: 600 },
  { name: "Masque Nila", price: 1300 },
  { name: "Baume réparateur", price: 600 },
  { name: "Dentifrice", price: 600 },
  { name: "Baume à lèvres", price: 400 },
  { name: "Sérum visage", price: 1800 },
  { name: "Crème de jour", price: 2000 },
  { name: "Gommage", price: 1600 },
  { name: "Stick", price: 900 },
  { name: "Écran total", price: 1500 },
  { name: "Eau de rose", price: 800 },
  { name: "Lotion nétoyante", price: 1200 },
];