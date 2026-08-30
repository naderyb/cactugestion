export function formatPhoneDisplay(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return digits.replace(/(\d{2})(?=\d)/g, "$1 ").trim();
}
