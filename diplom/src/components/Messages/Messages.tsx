import { Bell, Ellipsis } from "lucide-react";
import styles from "./Messages.module.css";
import { ModalType } from "../Header/Header";

interface MessagesProps {
  setActiveModal: (value: ModalType) => void;
}

export function Messages({ setActiveModal }: MessagesProps) {
  const handleClickOutside = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setActiveModal(null);
    }
  };

  return (
    <div className={styles["modal_main"]} onClick={handleClickOutside}>
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
