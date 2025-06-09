import { Bell, CircleX, Ellipsis } from "lucide-react";
import styles from "./Messages.module.css";
import { ModalType } from "../Header/Header";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import axios from "axios";
import { useEffect, useState } from "react";
import { MessageProps } from "../../types/message.props";
import { ProjectMembersProps } from "../../types/project-members.props";

interface MessagesProps {
  setActiveModal: (value: ModalType) => void;
  getNotifications?: () => Promise<void>;
  closeModal: () => void;
  setIsAuth: (value: boolean) => void;
}

export function Messages({
  setActiveModal,
  getNotifications,
}: MessagesProps) {
  const [message, setMessage] = useState<MessageProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getMessage();
  }, []);

  const getMessage = async () => {
    const jwt = Cookies.get("jwt");
    setIsLoading(true);
    if (!jwt) return;

    try {
      const decoded = jwtDecode<{ sub: string }>(jwt);
      const user_id = parseInt(decoded.sub, 10);

      const response = await axios.get<MessageProps[]>(
        `http://127.0.0.1:8000/notifications/${user_id}`
      );
      
      // Фильтруем уведомления для текущего пользователя
      const userMessages = response.data.filter(
        notification => 
          notification.recipient_id === user_id ||
          notification.sender_id === user_id
      );

      setMessage(userMessages);
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

  const rejectMessage = async (notificationId: number) => {
    try {
      await axios.post<MessageProps>(
        `http://127.0.0.1:8000/notifications/reject-notification/${notificationId}`
      );

      await getMessage();

      // Находим уведомление для обновления статуса
      const notification = message.find(mes => mes.id === notificationId);
      if (!notification) return;


      // Обновляем UI
      setMessage(prev => prev.map(mes => 
        mes.id === notificationId ? { ...mes, status: "rejected" } : mes
      ));

            // Удаляем из LocalStorage
      const storageKey = `notification_${notification.recipient_id}_${notification.project_id}`;
      localStorage.removeItem(storageKey);

      const storageKey1 = `project_notification_${notification.recipient_id}_${notification.project_id}`;
      localStorage.removeItem(storageKey1);

      if (getNotifications) {
        await getNotifications();
      }
    } catch (error) {
      console.error("Ошибка при отклонении уведомления:", error);
    }
  };

  const acceptMessage = async (notificationId: number) => {
    
    try {
      // Находим уведомление для получения данных
      const notification = message.find(mes => mes.id === notificationId);
      if (!notification) return;
      
      // Принимаем уведомление на сервере
      await axios.post<MessageProps>(
        `http://127.0.0.1:8000/notifications/accept-notification/${notificationId}`
      );

      await getMessage();

      // Обновляем LocalStorage
      const storageKey = `notification_${notification.recipient_id}_${notification.project_id}`;
      const existingData = localStorage.getItem(storageKey);
      
      if (existingData) {
        const notificationData = JSON.parse(existingData);
        notificationData.status = "accepted";
        localStorage.setItem(storageKey, JSON.stringify(notificationData));
      }

      const projectKey = `project_notification_${notification.recipient_id}_${notification.project_id}`;
      const existingData1 = localStorage.getItem(projectKey);
      
      if (existingData1) {
        const notificationData = JSON.parse(existingData1);
        notificationData.status = "accepted";
        localStorage.setItem(projectKey, JSON.stringify(notificationData));
      }

      // Подготавливаем данные для проекта и чата
      const projectMembersData = {
        project_id: notification.project_id,
        recipient_id: notification.recipient_id,
        sender_id: notification.sender_id,
        notification_id: notificationId,
      };

      const chatData = {
        recipient_id: notification.recipient_id,
        sender_id: notification.sender_id,
      };

      try {
        // Создаем чат (если еще не существует)
        await axios.post(`http://127.0.0.1:8000/chat/session`, null, {
          params: chatData,
        });
      } catch (chatError) {
        if (
          axios.isAxiosError(chatError) &&
          chatError.response?.status === 400
        ) {
          console.log("Чат уже существует");
        } else {
          console.error("Ошибка при создании чата:", chatError);
        }
      }

      // Добавляем участника в проект
      await axios.post<ProjectMembersProps>(
        "http://127.0.0.1:8000/project-members/",
        projectMembersData
      );

      // Обновляем UI
      setMessage(prev => prev.map(mes => 
        mes.id === notificationId ? { ...mes, status: "accepted" } : mes
      ));

      if (getNotifications) {
        await getNotifications();
      }
    } catch (error) {
      console.error("Ошибка при принятии уведомления:", error);
    }
  };

  const deleteMessage = async (notificationId: number) => {
    try {
      // Находим уведомление для получения данных
      const notification = message.find(mes => mes.id === notificationId);
      if (!notification) return;

      // Удаляем уведомление на сервере
      await axios.delete(
        `http://127.0.0.1:8000/notifications/delete-notification/${notificationId}`
      );


      // Обновляем UI
      setMessage(prev => prev.filter(mes => mes.id !== notificationId));

      if (getNotifications) {
        await getNotifications();
      }
    } catch (error) {
      console.error("Ошибка при удалении уведомления:", error);
    }
  };

  if (message.length === 0) {
    return (
      <div className={styles["modal_main"]} onClick={handleClickOutside}>
        <div className={styles["modal_secondary"]}>
          <div className={styles.header}>
            <p>Уведомления</p>
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

  if (isLoading) {
    return (
      <div className={styles["modal_main"]} onClick={handleClickOutside}>
        <div className={styles["modal_secondary"]}>
          <div className={styles.header}>
            <p>Уведомления</p>
          </div>
          <div>Загрузка...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles["modal_main"]} onClick={handleClickOutside}>
      <div className={styles["modal_secondary"]}>
        <div className={styles.header}>
          <p>Уведомления</p>
        </div>
        {message.map((mes) => (
          <div key={mes.id} className={styles.main}>
            <div className={styles.new_message}>
              <p>{mes.text}</p>
              {(mes.status === "rejected" || mes.status === "accepted") && (
                <CircleX 
                  className={styles.icon} 
                  onClick={() => deleteMessage(mes.id)} 
                />
              )}
            </div>
            {mes.status === "pending" && (
              <div className={styles.message_buttons}>
                <button 
                  className={styles.button_add} 
                  onClick={() => acceptMessage(mes.id)}
                >
                  Принять
                </button>
                <button 
                  className={styles.button_close} 
                  onClick={() => rejectMessage(mes.id)}
                >
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