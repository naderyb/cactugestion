import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/current-user";
import { LogoutButton } from "./logout-button";
import styles from "./dashboard-layout.module.css";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <img
          src="/logo.png"
          alt="Cactuvia"
          className={styles.logoImage}
        />
        <div className={styles.userZone}>
          <span className={styles.userName}>{user.fullName}</span>
          <LogoutButton />
        </div>
      </header>
      <main className={styles.content}>{children}</main>
    </div>
  );
}
