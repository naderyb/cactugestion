"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { TextField } from "@/components/ui/text-field";
import { SubmitButton } from "@/components/ui/submit-button";
import styles from "@/components/ui/auth-card.module.css";

export function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Une erreur est survenue.");
        return;
      }

      router.push(data.redirect ?? "/commandes");
      router.refresh();
    } catch {
      setError("Impossible de se connecter. Vérifie ta connexion internet.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {error && (
        <p className={styles.formError} role="alert">
          {error}
        </p>
      )}

      <TextField
        label="Nom d'utilisateur"
        name="username"
        autoComplete="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />

      <TextField
        label="Mot de passe"
        name="password"
        type="password"
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <SubmitButton type="submit" loading={loading}>
        Se connecter
      </SubmitButton>
    </form>
  );
}
