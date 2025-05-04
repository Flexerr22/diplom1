import {CircleArrowUp } from "lucide-react";
import Header from "../../components/Header/Header";
import styles from "./Chats.module.css";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { MessageProps } from "../../helpers/message.props";
import axios from "axios";
import { ProfileInfo } from "../../helpers/user.props";

interface Chat {
  sender: number;
  receiver: number;
  text: string;
  time: string;
}

interface UserProfile {
  id: number;
  name: string;
  avatar: string;
}

function Chats() {
  const [sender, setSender] = useState<number | null>(null);
  const [, setNotificationId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Chat[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [user, setUser] = useState<number | null>(null);
  const [userProfiles, setUserProfiles] = useState<{
    [key: number]: UserProfile;
  }>({});
  const [notifications, setNotifications] = useState<MessageProps[]>([]);

  // Загрузка сообщений из localStorage
  useEffect(() => {
    const storedMessages = localStorage.getItem("messages");
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    }
  }, []);

  // Сохраняем в localStorage при изменении сообщений
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("messages", JSON.stringify(messages));
    }
  }, [messages]);

  // Загрузка профилей пользователей
  useEffect(() => {
    const fetchUserProfiles = async () => {
      const uniqueUserIds = Array.from(
        new Set(notifications.map((n) => n.sender_id))
      );

      const profiles: { [key: number]: UserProfile } = {};
      for (const userId of uniqueUserIds) {
        try {
          const response = await axios.get<ProfileInfo>(
            `http://127.0.0.1:8000/users/${userId}`
          );
          profiles[userId] = {
            id: userId,
            name: response.data.name,
            avatar: response.data.avatar,
          };
        } catch (error) {
          console.error(`Ошибка загрузки профиля ${userId}:`, error);
        }
      }
      setUserProfiles((prev) => ({ ...prev, ...profiles }));
    };

    if (notifications.length > 0) {
      fetchUserProfiles();
    }
  }, [notifications]);

  // Загрузка уведомлений
  // В секции загрузки уведомлений изменим функцию getMessage:
  const getMessage = async () => {
    const jwt = Cookies.get("jwt");
    if (!jwt || !user) return;

    try {
      const response = await axios.get<MessageProps[]>(
        `http://127.0.0.1:8000/notifications/${user}`
      );

      // Фильтруем и группируем уведомления
      const uniqueNotifications = response.data.reduce((acc, current) => {
        if (current.status === "accepted") {
          // Создаем уникальный ключ для пары пользователей
          const usersPair = [
            Math.min(current.sender_id, current.recipient_id),
            Math.max(current.sender_id, current.recipient_id),
          ].join("-");

          // Если такой пары еще нет - добавляем
          if (!acc[usersPair]) {
            acc[usersPair] = current;
          }
        }
        return acc;
      }, {} as Record<string, MessageProps>);

      setNotifications(Object.values(uniqueNotifications));

      // Выбираем первый чат по умолчанию
      const firstNotification = Object.values(uniqueNotifications)[0];
      setSender(firstNotification?.sender_id ?? null);
      setNotificationId(firstNotification?.id ?? null);
    } catch (error) {
      console.error("Ошибка загрузки уведомлений:", error);
    }
  };

  // Инициализация пользователя
  useEffect(() => {
    const jwt = Cookies.get("jwt");
    if (!jwt) return;

    try {
      const decoded = jwtDecode<{ sub: string }>(jwt);
      setUser(parseInt(decoded.sub, 10));
    } catch (error) {
      console.error("Ошибка декодирования JWT:", error);
    }
  }, []);

  // Обновление уведомлений при изменении пользователя
  useEffect(() => {
    if (user) getMessage();
  }, [user]);

  // Отправка сообщения
  const sendMessage = () => {
    if (!inputValue.trim() || !user || !sender) return;

    const newMessage: Chat = {
      sender: user,
      receiver: sender,
      text: inputValue,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue("");
  };

  // Фильтрация сообщений
  const chatMessages = messages.filter(
    (m) =>
      (m.sender === user && m.receiver === sender) ||
      (m.sender === sender && m.receiver === user)
  );

  return (
    <>
      <Header />
      <div className={styles.main}>
        <div className={styles.topbar}>
          <div className={styles.all_messages}>
            <p>Все сообщения</p>
          </div>
          <div className={styles.messages}>
            <p className={styles.title_name}>
              {userProfiles[sender ?? -1]?.name || "Выберите чат"}
            </p>
          </div>
        </div>

        <div className={styles.menu}>
          <div className={styles.blocks}>
            {notifications.map((notification) => {
              const profile = userProfiles[notification.sender_id];
              return (
                <div
                  key={notification.id}
                  className={styles.people_block}
                  onClick={() => setSender(notification.sender_id)}
                >
                  {profile?.avatar && (
                    <img
                      src={
                        profile.avatar
                          ? `http://127.0.0.1:8000/${profile.avatar}`
                          : "/team.avif"
                      }
                      width={30}
                      height={30}
                      alt={profile.name}
                      className={styles.avatar}
                    />
                  )}
                  <div>
                    <p className={styles.user_name}>
                      {profile?.name || "Неизвестный"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className={styles.chat}>
            <div className={styles.newMessage}>
              {chatMessages.map((msg, index) => (
                <div
                  key={index}
                  className={`${styles.mes_block} ${
                    msg.sender === user
                      ? styles["current-user"]
                      : styles["other-user"]
                  }`}
                >
                  <div className={styles.message}>
                    <p className={styles.text}>{msg.text}</p>
                    <p className={styles.chat_time}>{msg.time}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.input}>
              <input
                placeholder="Написать сообщение"
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <CircleArrowUp className={styles.icon} onClick={sendMessage} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Chats;
