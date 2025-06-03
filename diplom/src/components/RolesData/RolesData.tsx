import { CircleCheckBig } from "lucide-react";
import Button from "../Button/Button";
import styles from "./RolesData.module.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import Cookies from "js-cookie";
import { ProductProps, RolesGroupProps } from "../../types/projects.props";
import { MessageProps } from "../../types/message.props";
import { RatingProps } from "../../types/rating.props";

export function RolesData({
  id,
  name,
  description,
  specialization,
  budget,
  experience,
  role,
}: RolesGroupProps) {
  const [isAdd, setIsAdd] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [notificationId, setNotificationId] = useState<number | null>(null);
  const [userProjects, setUserProjects] = useState<ProductProps[]>([]);
  const [isAccept, setIsAccept] = useState(false);
  const [isReject, setIsReject] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(
    null
  );
  const [rating, setRating] = useState<RatingProps | null>(null);

  useEffect(() => {
    getRating();
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

    const getAll = async () => {
      const jwt = Cookies.get("jwt");
      if (!jwt) return;

      try {
        const decoded = jwtDecode<{ sub: string }>(jwt);
        const user_id = parseInt(decoded.sub, 10);

        const response = await axios.get<ProductProps[]>(
          `http://127.0.0.1:8000/projects/my-projects/${user_id}`
        );
        console.log("Ответ от сервера:", response.data);
        setUserProjects(response.data);

        if (response.data.length > 0) {
          setSelectedProjectId(response.data[0].id);
        }
      } catch (error) {
        console.error("Ошибка при получении проектов:", error);
      }
    };
    checkExistingNotification();
    getAll();
  }, [id]);


  const checkExistingNotification = async () => {
    const jwt = Cookies.get("jwt");
    if (!jwt || !selectedProjectId) return;
  
    try {
      const decoded = jwtDecode<{ sub: string }>(jwt);
      const user_id = parseInt(decoded.sub, 10);
  
      const response = await axios.get<MessageProps[]>(
        `http://127.0.0.1:8000/notifications/user-notifications/${user_id}`
      );
  
      const existingNotification = response.data.find(
        (notif) =>
          notif.project_id === selectedProjectId &&
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
            project_id: selectedProjectId,
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
    const favorite_id = id;

    try {
      await axios.post(
        `http://127.0.0.1:8000/mentors-investors/favorites/add-to-favorites/${user_id}/${favorite_id}?favorite_user_id=${favorite_id}`
      );
      setIsAdd(true);

      const favorites = JSON.parse(
        localStorage.getItem("favorites_user") || "[]"
      );
      if (!favorites.includes(id)) {
        favorites.push(id);
        localStorage.setItem("favorites_user", JSON.stringify(favorites));
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Ошибка сервера:", error.response?.data);
      } else {
        console.error("Неизвестная ошибка:", error);
      }
    }
  };

  const postMessage = async () => {
    if (!selectedProjectId) {
      alert("Пожалуйста, выберите проект для сотрудничества");
      return;
    }
    const jwt = Cookies.get("jwt");
    if (!jwt) {
      alert("Войдите в систему, чтобы отправить запрос");
      return;
    }

    try {
      setIsSending(true);

      const decoded = jwtDecode<{ sub: string }>(jwt);
      const sender_id = parseInt(decoded.sub, 10);
      const recipient_id = id;

      if (sender_id === id) {
        alert("Нельзя отправить запрос самому себе!");
        return;
      }
      const notificationData = {
        project_id: selectedProjectId,
        recipient_id: id,
        sender_id,
        status: "pending",
        text: `Пользователь хочет сотрудничать по проекту с вами как "${role}"`,
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

  const getRating = async () => {
    const responce = await axios.get<RatingProps>(
      `http://127.0.0.1:8000/ratings/get-avg-rating/${id}`
    );
    setRating(responce.data);
    console.log(responce.data);
  };

  const deleteMessage = async () => {
    if (!notificationId) return;

    try {
      await axios.delete(
        `http://127.0.0.1:8000/notifications/delete-notification/${notificationId}`
      );

      setNotificationId(null);
      setIsSending(false);

      localStorage.removeItem(`notification_${notificationId}`);
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
        {rating?.average_rating ? (
          <div className={styles.rating}>
            <p>{rating.average_rating}</p>
            <span>★</span>
          </div>
        ) : (
          ""
        )}
        <b className={styles["title"]}>"{name}"</b>
        <textarea className={styles["description"]} disabled>
          {description}
        </textarea>
        <div className={styles["price"]}>
          {role === "mentor" ? (
            <b>Опыт работы:</b>
          ) : role === "investor" ? (
            <b>Бюджет:</b>
          ) : (
            ""
          )}
          {role === "mentor" ? (
            <p>{experience} мес.</p>
          ) : role === "investor" ? (
            <p>
              {Number(budget).toLocaleString('ru-RU')} ₽
            </p>
          ) : (
            ""
          )}
        </div>
        <div className={styles["reit"]}>
          <b>Специальность: </b>
          <p>{specialization}</p>
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
          <Link to={`/user/${id}`}>
            <Button className={styles["button_product"]}>Подробнее</Button>
          </Link>
          {userProjects.length > 0 && (
            <div className={styles["project-selector"]}>
              <label>Выберите проект:</label>
              <select
                onChange={(e) => setSelectedProjectId(Number(e.target.value))}
                value={selectedProjectId || ""}
              >
                {userProjects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.title}
                  </option>
                ))}
              </select>
            </div>
          )}
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
