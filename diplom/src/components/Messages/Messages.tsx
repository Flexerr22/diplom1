import { Bell, CircleX, Ellipsis } from "lucide-react";
import styles from "./Messages.module.css";
import Header, { ModalType } from "../Header/Header";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import axios from "axios";
import { useEffect, useState } from "react";
import { MessageProps } from "../../types/message.props";
import { ProjectMembersProps } from "../../types/project-members.props";
import { Container } from "../Container/Container";
import { Modal } from "../Modal/Modal";
import Button from "../Button/Button";

interface MessagesProps {
  setActiveModal: (value: ModalType) => void;
  getNotifications?: () => Promise<void>;
  closeModal: () => void;
  setIsAuth: (value: boolean) => void;
}

export function Messages({
  setActiveModal,
  getNotifications,
  closeModal,
  setIsAuth,
}: MessagesProps) {
  const [message, setMessage] = useState<MessageProps[]>([]);
  const [notificationId, setNotificationId] = useState<number | null>(null);
  const [deleteNotificationId, setDeleteNotificationId] = useState<
    number | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [isAuthtozise, setIsAuthtorize] = useState(false);

  useEffect(() => {
    const jwt = Cookies.get("jwt");

    if (jwt) {
      setIsAuthtorize(true);
    }
  }, []);

  useEffect(() => {
    getMessage();
  }, []);

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
          (notification.recipient_id === user_id ||
            notification.sender_id === user_id) &&
          (notification.status === "rejected" ||
            notification.status === "accepted")
      );

      console.log(extMessage);

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

  const handleClickOutside = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setActiveModal(null);
    }
  };

  const rejectMessage = async () => {
    if (!notificationId) return;

    await axios.post<MessageProps>(
      `http://127.0.0.1:8000/notifications/reject-notification/${notificationId}`
    );

    const localNotification = localStorage.getItem(
      `notification_${notificationId}`
    );
    if (localNotification) {
      const notificationData = JSON.parse(localNotification);
      notificationData.status = "rejected";
      localStorage.setItem(
        `notification_${notificationId}`,
        JSON.stringify(notificationData)
      );
    }

    if (getNotifications) {
      await getNotifications();
    }
    // localStorage.removeItem(`notification_${notificationId}`);
    setNotificationId(null);
    await getMessage();
  };

  const acceptMessage = async () => {
    if (!notificationId) return;

    try {
      // Принимаем уведомление
      await axios.post<MessageProps>(
        `http://127.0.0.1:8000/notifications/accept-notification/${notificationId}`
      );

      // Обновляем статус уведомления в localStorage
      const localNotification = localStorage.getItem(
        `notification_${notificationId}`
      );
      if (!localNotification) {
        console.error("Уведомление не найдено в localStorage");
        return;
      }

      const notificationData = JSON.parse(localNotification);
      notificationData.status = "accepted";
      localStorage.setItem(
        `notification_${notificationId}`,
        JSON.stringify(notificationData)
      );

      // Подготавливаем данные для проекта и чата
      const projectMembersData = {
        project_id: notificationData.project_id,
        recipient_id: notificationData.recipient_id,
        sender_id: notificationData.sender_id,
        notification_id: notificationData.notificationId,
      };

      const chatData = {
        recipient_id: notificationData.recipient_id,
        sender_id: notificationData.sender_id,
      };

      try {
        // Пытаемся создать чат, но обрабатываем случай, когда он уже существует
        await axios.post(`http://127.0.0.1:8000/chat/session`, null, {
          params: chatData,
        });
      } catch (chatError) {
        if (
          axios.isAxiosError(chatError) &&
          chatError.response?.status === 400
        ) {
          console.log("Чат уже существует, пропускаем создание");
        } else {
          throw chatError; // Перебрасываем другие ошибки
        }
      }

      // Добавляем участника в проект
      await axios.post<ProjectMembersProps>(
        "http://127.0.0.1:8000/project-members/",
        projectMembersData
      );

      // Обновляем данные
      if (getNotifications) {
        await getNotifications();
      }
      setNotificationId(null);
      await getMessage();
    } catch (error) {
      console.error("Ошибка при принятии уведомления:", error);
      // Здесь можно добавить обработку ошибки, например, показать сообщение пользователю
    }
  };

  const deleteMessage = async () => {
    if (!deleteNotificationId) return;

    await axios.delete(
      `http://127.0.0.1:8000/notifications/delete-notification/${deleteNotificationId}`
    );

    localStorage.removeItem(`notification_${deleteNotificationId}`);
    if (getNotifications) {
      await getNotifications();
    }
    setDeleteNotificationId(null);
    await getMessage();
  };

  if (!isAuthtozise) {
    return (
      <div className={styles["modal_main"]} onClick={handleClickOutside}>
        <div className={styles["modal_secondary"]}>
          <div className={styles.auth}>
            <Bell size={75} className={styles.icon} />
            <b>
              Вы еще неавторизованы в системе. Пожалуйста авторизуйтесь чтобы
              иметь возможность получать уведомления
            </b>
            <Button
              appearence="small"
              className={styles["button_register_info"]}
              onClick={() => setModalOpen(true)}
            >
              Зарегистрироваться
            </Button>
          </div>
          {modalOpen && (
            <div className={styles["modal_main"]}>
              <div className={styles["modal_secondary"]}>
                <button
                  onClick={() => setModalOpen(false)}
                  className={styles["close"]}
                >
                  ✖
                </button>
                <Modal closeModal={closeModal} setIsAuth={setIsAuth} />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

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
              {mes.status === "rejected" && (
                <CircleX className={styles.icon} onClick={deleteMessage} />
              )}
              {mes.status === "accepted" && (
                <CircleX className={styles.icon} onClick={deleteMessage} />
              )}
            </div>
            {mes.status === "pending" && (
              <div className={styles.message_buttons}>
                <button className={styles.button_add} onClick={acceptMessage}>
                  Принять
                </button>
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
