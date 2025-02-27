import { Bell, Ellipsis } from "lucide-react";
import styles from "./Messages.module.css";

export function Messages() {
  return (
    <div className={styles["modal_main"]}>
      <div className={styles["modal_secondary"]}>
        <div className={styles.header}>
          <p>Уведомления</p>
          <Ellipsis size={20} />
        </div>
        <div className={styles.messages_block}>
          <Bell size={75} className={styles.icon} />
          <b>Ещё нет уведомлений</b>
          <p>
            Здесь будут уведомления об изменении цены и новых объявлениях по
            вашему поиску
          </p>
        </div>
      </div>
    </div>
  );
}
