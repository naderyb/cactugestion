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
  { name: "Lotion nettoyante", price: 1200 },
  { name: "Gel de cactus", price: 1200 },
];

export interface DeliveryTariff {
  bureau: number | null;
  domicile: number | null;
}

// Grille tarifaire Yalidine (départ Bouira). `null` = zone non desservie
// par le tarif standard ("غ.م" sur la fiche) donc prix à confirmer manuellement.
export const DELIVERY_PRICES: Record<string, DeliveryTariff> = {
  Adrar: { bureau: 1400, domicile: 1600 },
  Chlef: { bureau: 500, domicile: 650 },
  Laghouat: { bureau: 900, domicile: 1100 },
  "Oum El Bouaghi": { bureau: 600, domicile: 750 },
  Batna: { bureau: 600, domicile: 750 },
  Béjaïa: { bureau: 500, domicile: 650 },
  Biskra: { bureau: 900, domicile: 1100 },
  Béchar: { bureau: 1400, domicile: 1600 },
  Blida: { bureau: 500, domicile: 650 },
  Bouira: { bureau: 400, domicile: 540 },
  Tamanrasset: { bureau: 1400, domicile: 1600 },
  Tébessa: { bureau: 900, domicile: 1100 },
  Tlemcen: { bureau: 600, domicile: 750 },
  Tiaret: { bureau: 700, domicile: 850 },
  "Tizi Ouzou": { bureau: 500, domicile: 650 },
  Alger: { bureau: 500, domicile: 650 },
  Djelfa: { bureau: 700, domicile: 850 },
  Jijel: { bureau: 600, domicile: 750 },
  Sétif: { bureau: 600, domicile: 750 },
  Saïda: { bureau: 700, domicile: 850 },
  Skikda: { bureau: 600, domicile: 750 },
  "Sidi Bel Abbès": { bureau: 600, domicile: 750 },
  Annaba: { bureau: 600, domicile: 750 },
  Guelma: { bureau: 600, domicile: 750 },
  Constantine: { bureau: 600, domicile: 750 },
  Médéa: { bureau: 600, domicile: 750 },
  Mostaganem: { bureau: 600, domicile: 750 },
  "M'Sila": { bureau: 600, domicile: 750 },
  Mascara: { bureau: 600, domicile: 750 },
  Ouargla: { bureau: 900, domicile: 1100 },
  Oran: { bureau: 600, domicile: 750 },
  "El Bayadh": { bureau: 1400, domicile: 1600 },
  Illizi: { bureau: 1400, domicile: 1600 },
  "Bordj Bou Arréridj": { bureau: 600, domicile: 750 },
  Boumerdès: { bureau: 500, domicile: 650 },
  "El Tarf": { bureau: 700, domicile: 850 },
  Tindouf: { bureau: 1400, domicile: 1600 },
  Tissemsilt: { bureau: 700, domicile: 850 },
  "El Oued": { bureau: 900, domicile: 1100 },
  Khenchela: { bureau: 700, domicile: 850 },
  "Souk Ahras": { bureau: 700, domicile: 850 },
  Tipaza: { bureau: 500, domicile: 650 },
  Mila: { bureau: 600, domicile: 750 },
  "Aïn Defla": { bureau: 600, domicile: 750 },
  Naâma: { bureau: 1400, domicile: 1600 },
  "Aïn Témouchent": { bureau: 900, domicile: 1100 },
  Ghardaïa: { bureau: 900, domicile: 1100 },
  Relizane: { bureau: 600, domicile: 750 },
  Timimoun: { bureau: 1400, domicile: 1600 },
  "Bordj Badji Mokhtar": { bureau: null, domicile: null },
  "Ouled Djellal": { bureau: 900, domicile: 1100 },
  "Béni Abbès": { bureau: 1400, domicile: 1600 },
  "In Salah": { bureau: 1400, domicile: 1600 },
  "In Guezzam": { bureau: null, domicile: null },
  Touggourt: { bureau: 900, domicile: 1100 },
  Djanet: { bureau: 1400, domicile: 1600 },
  "El M'Ghair": { bureau: 900, domicile: 1100 },
  "El Meniaa": { bureau: 900, domicile: 1100 },
};