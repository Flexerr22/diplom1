import { Bell, CircleX, Ellipsis } from "lucide-react";
import styles from "./Messages.module.css";
import { ModalType } from "../Header/Header";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import axios from "axios";
import { useEffect, useState } from "react";
import { MessageProps } from "../../helpers/message.props";

interface MessagesProps {
  setActiveModal: (value: ModalType) => void;
  getNotifications?: () => Promise<void>;
}

export function Messages({ setActiveModal, getNotifications }: MessagesProps) {
  const [message, setMessage] = useState<MessageProps[]>([]);
  const [notificationId, setNotificationId] = useState<number | null>(null);
  const [deleteNotificationId, setDeleteNotificationId] = useState<
    number | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);
  const handleClickOutside = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setActiveModal(null);
    }
  };

  useEffect(() => {
    getMessage();
  });

  const getMessage = async () => {
    const jwt = Cookies.get("jwt");
    setIsLoading(false);
    if (!jwt) return;

    try {
      const decoded = jwtDecode<{ sub: string }>(jwt);
      const user_id = parseInt(decoded.sub, 10);

      const responce = await axios.get<MessageProps[]>(
        `http://127.0.0.1:8000/notifications/${user_id}`
      );

      const extMessage = responce.data.find(
        (notification) =>
          notification.recipient_id === user_id &&
          notification.status === "pending"
      );

      const delMessage = responce.data.find(
        (notification) =>
          notification.recipient_id === user_id &&
          notification.status === "rejected"
      );

      if (extMessage) {
        setNotificationId(extMessage.id);
      } else {
        setNotificationId(null);
      }

      if (delMessage) {
        setDeleteNotificationId(delMessage.id);
      } else {
        setDeleteNotificationId(null);
      }
      setMessage(responce.data);
    } catch (error) {
      console.error("Произошла ошибка", error);
    } finally {
      setIsLoading(false);
    }
  };

  const rejectMessage = async () => {
    if (!notificationId) return;

    await axios.post<MessageProps>(
      `http://127.0.0.1:8000/notifications/reject-notification/${notificationId}`
    );

    if (getNotifications) {
      await getNotifications();
    }
    localStorage.removeItem("notification");
    setNotificationId(null);
  };

  const deleteMessage = async () => {
    if (!deleteNotificationId) return;

    await axios.delete(
      `http://127.0.0.1:8000/notifications/delete-notification/${deleteNotificationId}`
    );

    if (getNotifications) {
      await getNotifications();
    }
    setDeleteNotificationId(null);
    await getMessage();
  };

  if (isLoading) {
    return (
      <div className={styles["modal_main"]} onClick={handleClickOutside}>
        <div className={styles["modal_secondary"]}>
          <div className={styles.header}>
            <p>Уведомления</p>
            <Ellipsis size={20} />
          </div>
          <div>Загрузка...</div>
        </div>
      </div>
    );
  }

  if (message.length === 0) {
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

  return (
    <div className={styles["modal_main"]} onClick={handleClickOutside}>
      <div className={styles["modal_secondary"]}>
        <div className={styles.header}>
          <p>Уведомления</p>
          <Ellipsis size={20} />
        </div>
        {message.map((mes) => (
          <div key={mes.id} className={styles.main}>
            <div className={styles.new_message}>
              <p>{mes.text}</p>
              {mes.status !== "pending" && (
                <CircleX className={styles.icon} onClick={deleteMessage} />
              )}
            </div>
            {mes.status === "pending" && (
              <div className={styles.message_buttons}>
                <button className={styles.button_add}>Принять</button>
                <button className={styles.button_close} onClick={rejectMessage}>
                  Отклонить
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
