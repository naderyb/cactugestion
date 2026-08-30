"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "./dashboard-layout.module.css";

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      className={styles.logoutButton}
      onClick={handleLogout}
      disabled={loading}
    >
      Déconnexion
    </button>
  );
}
