import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/current-user";
import { LoginForm } from "./login-form";
import styles from "@/components/ui/auth-card.module.css";

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) redirect("/commandes");

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <img src="/logo.png" alt="Cactuvia" className={styles.logoImage} />
        <p className={styles.subtitle}>Gestion des commandes</p>
        <LoginForm />
      </div>
    </main>
  );
}
