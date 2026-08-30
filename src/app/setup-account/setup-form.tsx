"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { TextField } from "@/components/ui/text-field";
import { SubmitButton } from "@/components/ui/submit-button";
import styles from "@/components/ui/auth-card.module.css";

export function SetupForm() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/setup-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, password, confirmPassword }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Une erreur est survenue.");
        return;
      }

      router.push(data.redirect ?? "/commandes");
      router.refresh();
    } catch {
      setError("Impossible de créer le compte. Vérifie ta connexion internet.");
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
        label="Nom complet"
        name="fullName"
        autoComplete="name"
        placeholder="Nom complet"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        required
        minLength={3}
      />

      <TextField
        label="Mot de passe"
        name="password"
        type="password"
        autoComplete="new-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        minLength={8}
      />

      <TextField
        label="Confirme le mot de passe"
        name="confirmPassword"
        type="password"
        autoComplete="new-password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
        minLength={8}
      />

      <SubmitButton type="submit" loading={loading}>
        Créer mon compte
      </SubmitButton>
    </form>
  );
}
