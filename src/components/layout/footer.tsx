import { Column, Text, ThemeSwitcher } from "@/ui/components";
import styles from "./layout.module.scss";

export const PageFooter = () => {
  return (
    <Column horizontal="center" vertical="end" gap="16" paddingY="16" className={styles.footer}>
      <ThemeSwitcher />
      <Text variant="body-default-s">© 2025 Pharos Network</Text>
    </Column>
  );
};