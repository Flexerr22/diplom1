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
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    if (favorites.includes(id)) {
      setIsAdd(true);
    }

    // Используем уникальный ключ для проекта
    const storageKey = `project_notification_${user_id}_${id}`;
    const notificationData = localStorage.getItem(storageKey);
    
    if (notificationData) {
      const notification = JSON.parse(notificationData);
      setNotificationId(notification.notificationId);
      setIsSending(notification.status === "pending");
      setIsAccept(notification.status === "accepted");
      setIsReject(notification.status === "rejected");
    }

    checkExistingNotification();
  }, [id, user_id]); // Добавляем user_id в зависимости

  const checkExistingNotification = async () => {
    const jwt = Cookies.get("jwt");
    if (!jwt) return;
  
    try {
      const decoded = jwtDecode<{ sub: string }>(jwt);
      const current_user_id = parseInt(decoded.sub, 10);
  
      const response = await axios.get<MessageProps[]>(
        `http://127.0.0.1:8000/notifications/user-notifications/${current_user_id}`
      );
  
      // Ищем уведомление для этого проекта и текущего пользователя как отправителя
      const existingNotification = response.data.find(
        (notif) =>
          notif.project_id === id &&
          notif.sender_id === current_user_id
      );
  
      if (existingNotification) {
        const storageKey = `project_notification_${user_id}_${id}`;
        
        localStorage.setItem(
          storageKey,
          JSON.stringify({
            status: existingNotification.status,
            notificationId: existingNotification.id,
          })
        );
        
        setNotificationId(existingNotification.id);
        setIsSending(existingNotification.status === "pending");
        setIsAccept(existingNotification.status === "accepted");
        setIsReject(existingNotification.status === "rejected");
      } else {
        const storageKey = `project_notification_${user_id}_${id}`;
        localStorage.removeItem(storageKey);
        
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
    const current_user_id = parseInt(decoded.sub, 10);

    try {
      await axios.post(
        `http://127.0.0.1:8000/users/favorites/add-to-favorites/${current_user_id}/${id}`
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

      if (sender_id === user_id) {
        alert("Нельзя отправить запрос самому себе!");
        return;
      }

      const projectResponse = await axios.get(`http://127.0.0.1:8000/projects/${id}`);
      const userResponse = await axios.get(`http://127.0.0.1:8000/users/${sender_id}`);

      const notificationData = {
        project_id: id,
        recipient_id: user_id, // Владелец проекта
        sender_id,
        status: "pending",
        text: `Пользователь ${userResponse.data.name} хочет сотрудничать по проекту "${projectResponse.data.title}"`,
      };

      const response = await axios.post<MessageProps>(
        `http://127.0.0.1:8000/notifications/send-notification/${user_id}`,
        notificationData
      );

      // Используем уникальный ключ для проекта
      const storageKey = `project_notification_${user_id}_${id}`;
      localStorage.setItem(
        storageKey,
        JSON.stringify({
          status: "pending",
          notificationId: response.data.id,
        })
      );

      setNotificationId(response.data.id);
      alert("Запрос отправлен!");
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

      // Удаляем по уникальному ключу
      const storageKey = `project_notification_${user_id}_${id}`;
      localStorage.removeItem(storageKey);

      setNotificationId(null);
      setIsSending(false);
      alert("Заявка отменена");
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