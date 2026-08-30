import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SetupForm } from "./setup-form";
import styles from "@/components/ui/auth-card.module.css";

export default async function SetupAccountPage() {
  const cookieStore = await cookies();
  const hasSetupToken = cookieStore.has("setup_token");

  if (!hasSetupToken) redirect("/login");

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <img src="/logo.png" alt="Cactuvia" className={styles.logoImage} />
        <p className={styles.subtitle}>Crée ton compte personnel</p>
        <SetupForm />
        <p className={styles.footNote}>
          Ce nom et ce mot de passe seront désormais tes identifiants
          personnels.
        </p>
      </div>
    </main>
  );
}
