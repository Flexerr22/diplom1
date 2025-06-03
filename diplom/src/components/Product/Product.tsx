import axios from "axios";
import Button from "../Button/Button";
import styles from "./Product.module.css";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from "react";
import { CircleCheckBig } from "lucide-react";
import { ProductProps } from "../../types/projects.props";
import { MessageProps } from "../../types/message.props";

export function Product({
  id,
  title,
  tagline,
  investment,
  category,
  user_id,
}: ProductProps) {
  const [isAdd, setIsAdd] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isAccept, setIsAccept] = useState(false);
  const [isReject, setIsReject] = useState(false);
  const [notificationId, setNotificationId] = useState<number | null>(null);

  useEffect(() => {
    const favorites = JSON.parse(
      localStorage.getItem("favorites_user") || "[]"
    );
    if (favorites.includes(id)) {
      setIsAdd(true);
    }

    const notificationKeys = Object.keys(localStorage).filter(key => 
      key.startsWith("notification_")
    );
    
    for (const key of notificationKeys) {
      const notification = JSON.parse(localStorage.getItem(key) || "{}");
      if (notification.notificationId && notification.status === "pending") {
        setIsSending(true);
        setNotificationId(notification.notificationId);
        break;
      }
      if (notification.notificationId && notification.status === "accepted") {
        setIsAccept(true);
        setNotificationId(notification.notificationId);
        break;
      }
      if (notification.notificationId && notification.status === "rejected") {
        setIsReject(true);
        setNotificationId(notification.notificationId);
        break;
      }
    }
    checkExistingNotification();
  }, [id]);

  const checkExistingNotification = async () => {
    const jwt = Cookies.get("jwt");
    if (!jwt ) return;
  
    try {
      const decoded = jwtDecode<{ sub: string }>(jwt);
      const user_id = parseInt(decoded.sub, 10);
  
      const response = await axios.get<MessageProps[]>(
        `http://127.0.0.1:8000/notifications/user-notifications/${user_id}`
      );
  
      const existingNotification = response.data.find(
        (notif) =>
          notif.project_id === id &&
          notif.recipient_id === id
      );
  
      if (existingNotification) {
        setNotificationId(existingNotification.id);
        setIsSending(existingNotification.status === "pending");
        setIsAccept(existingNotification.status === "accepted");
        setIsAccept(existingNotification.status === "rejected");
        
        localStorage.setItem(
          `notification_${existingNotification.id}`,
          JSON.stringify({
            status: existingNotification.status,
            notificationId: existingNotification.id,
            project_id: id,
            recipient_id: id,
            timestamp: new Date().toISOString()
          })
        );
      } else {
        if (notificationId) {
          localStorage.removeItem(`notification_${notificationId}`);
        }
        setIsSending(false);
        setIsAccept(false);
        setIsReject(false);
        setNotificationId(null);
      }
    } catch (error) {
      console.error("Ошибка при проверке уведомлений:", error);
    }
  };

  const addFavourites = async () => {
    const jwt = Cookies.get("jwt");
    if (!jwt) {
      console.error("JWT-токен отсутствует");
      return;
    }

    const decoded = jwtDecode<{ sub: string }>(jwt);
    const user_id = parseInt(decoded.sub, 10);
    const project_id = id;

    try {
      await axios.post(
        `http://127.0.0.1:8000/users/favorites/add-to-favorites/${user_id}/${project_id}`
      );
      setIsAdd(true);

      const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
      if (!favorites.includes(id)) {
        favorites.push(id);
        localStorage.setItem("favorites", JSON.stringify(favorites));
      }
    } catch (error) {
      console.error("Ошибка сервера:", error);
    }
  };

  const postMessage = async () => {
    const jwt = Cookies.get("jwt");
    if (!jwt) {
      alert("Войдите в систему, чтобы отправить запрос");
      return;
    }

    try {
      setIsSending(true);

      const decoded = jwtDecode<{ sub: string }>(jwt);
      const sender_id = parseInt(decoded.sub, 10);
      const recipient_id = user_id;

      if (sender_id === user_id) {
        alert("Нельзя отправить запрос самому себе!");
        return;
      }
      const notificationData = {
        project_id: id,
        recipient_id: user_id,
        sender_id,
        status: "pending",
        text: `Пользователь хочет сотрудничать по проекту "${title}"`,
      };
      console.log(notificationData);
      const response = await axios.post<MessageProps>(
        `http://127.0.0.1:8000/notifications/send-notification/${recipient_id}`,
        notificationData
      );

      localStorage.setItem(
        `notification_${response.data.id}`,
        JSON.stringify({
          status: "pending",
          project_id: response.data.project_id,
          recipient_id: response.data.recipient_id,
          sender_id: response.data.sender_id,
          notificationId: response.data.id,
        })
      );

      setNotificationId(response.data.id);
      setIsSending(true);
      alert("Запрос отправлен!");

      // Проверяем сразу после отправки
      await checkExistingNotification();
    } catch (error) {
      console.error("Ошибка при отправке:", error);
      alert("Не удалось отправить запрос");
      setIsSending(false);
    }
  };

  const deleteMessage = async () => {
    if (!notificationId) return;

    try {
      await axios.delete(
        `http://127.0.0.1:8000/notifications/delete-notification/${notificationId}`
      );

      setNotificationId(null);
      setIsSending(false);

      localStorage.removeItem("notification");
      alert("Заявка отменена");

      // Проверяем сразу после удаления
      await checkExistingNotification();
    } catch (error) {
      console.error("Ошибка при отмене:", error);
      alert("Не удалось отменить заявку");
    }
  };

  return (
    <div>
      <div className={styles["product"]}>
        <b className={styles["title"]}>"{title}" </b>
        <textarea className={styles["description"]} disabled>
          {tagline}
        </textarea>
        <div className={styles["price"]}>
          <b>Требуемые вложения:</b>
          <p>
            {Number(investment).toLocaleString('ru-RU')} ₽
          </p>
        </div>
        <div className={styles["reit"]}>
          <b>Специальность: </b>
          <p>{category}</p>
        </div>
        <div className={styles["product-bottom"]}>
          {isAdd ? (
            <CircleCheckBig />
          ) : (
            <Button
              className={styles["button_product"]}
              onClick={addFavourites}
            >
              Добавить в избранное
            </Button>
          )}
          <Link to={`/project/${id}`}>
            <Button className={styles["button_product"]}>Подробнее</Button>
          </Link>
          {isAccept ? (
              <div className={styles.status_message}>
                <b>Заявка принята</b>
              </div>
            ) : isReject ? (
              <div className={styles.status_message}>
                <b>Заявка отклонена</b>
              </div>
            ) : isSending ? (
              <Button
                className={styles["button_product"]}
                onClick={deleteMessage}
              >
                Отменить заявку
              </Button>
            ) : (
              <Button className={styles["button_product"]} onClick={postMessage}>
                Сотрудничать
              </Button>
            )}
        </div>
      </div>
    </div>
  );
}
