export const ORDERS_SYNC_STORAGE_KEY = "cactugestion:orders-sync";

export function notifyOrdersUpdated() {
  if (typeof window === "undefined") return;

  const payload = { at: Date.now() };

  try {
    localStorage.setItem(ORDERS_SYNC_STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // Ignore storage errors in private browsing or restricted environments.
  }

  window.dispatchEvent(
    new CustomEvent("cactugestion:orders-sync", { detail: payload }),
  );
}

export function subscribeToOrdersUpdates(onChange: () => void) {
  if (typeof window === "undefined") return () => {};

  const handleStorage = (event: StorageEvent) => {
    if (event.key === ORDERS_SYNC_STORAGE_KEY) {
      onChange();
    }
  };

  const handleCustomEvent = () => {
    onChange();
  };

  window.addEventListener("storage", handleStorage);
  window.addEventListener(
    "cactugestion:orders-sync",
    handleCustomEvent as EventListener,
  );

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(
      "cactugestion:orders-sync",
      handleCustomEvent as EventListener,
    );
  };
}
