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

  const translateRole = (role: string) => {
    switch (role) {
      case "mentor":
        return "Ментор";
      case "investor":
        return "Инвестор";
      case "entrepreneur":
        return "Предприниматель";
      default:
        return role;
    }
  };

  useEffect(() => {
    getRating();
    const favorites = JSON.parse(
      localStorage.getItem("favorites_user") || "[]"
    );
    if (favorites.includes(id)) {
      setIsAdd(true);
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
        setUserProjects(response.data);

        if (response.data.length > 0) {
          setSelectedProjectId(response.data[0].id);
        }
      } catch (error) {
        console.error("Ошибка при получении проектов:", error);
      }
    };

    getAll();
  }, [id]);

  useEffect(() => {
    if (selectedProjectId !== null) {
      checkExistingNotification();
      checkLocalStorageNotification();
    }
  }, [selectedProjectId, id]);

  const checkLocalStorageNotification = () => {
    if (selectedProjectId === null) return;
    
    const storageKey = `notification_${id}_${selectedProjectId}`;
    const notificationData = localStorage.getItem(storageKey);
    
    if (notificationData) {
      const parsed = JSON.parse(notificationData);
      setNotificationId(parsed.notificationId);
      setIsSending(parsed.status === "pending");
      setIsAccept(parsed.status === "accepted");
      setIsReject(parsed.status === "rejected");
    } else {
      setIsSending(false);
      setIsAccept(false);
      setIsReject(false);
      setNotificationId(null);
    }
  };

  const checkExistingNotification = async () => {
    const jwt = Cookies.get("jwt");
    if (!jwt || selectedProjectId === null) return;

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

      const storageKey = `notification_${id}_${selectedProjectId}`;
      
      if (existingNotification) {
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
    if (selectedProjectId === null) {
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
      const projectResponse = await axios.get(
        `http://127.0.0.1:8000/projects/${selectedProjectId}`
      );
      const userResponse = await axios.get(
        `http://127.0.0.1:8000/users/${sender_id}`
      );

      const notificationData = {
        project_id: selectedProjectId,
        recipient_id: id,
        sender_id,
        status: "pending",
        text: `Пользователь ${userResponse.data.name} хочет сотрудничать по проекту "${projectResponse.data.title}" с вами как "${translateRole(
          role
        )}"`,
      };

      const response = await axios.post<MessageProps>(
        `http://127.0.0.1:8000/notifications/send-notification/${recipient_id}`,
        notificationData
      );

      const storageKey = `notification_${id}_${selectedProjectId}`;
      localStorage.setItem(
        storageKey,
        JSON.stringify({
          status: "pending",
          notificationId: response.data.id,
        })
      );

      setNotificationId(response.data.id);
      alert("Запрос отправлен!");
    } catch (error) {
      console.error("Ошибка при отправке:", error);
      alert("Не удалось отправить запрос");
      setIsSending(false);
    }
  };

  const getRating = async () => {
    try {
      const response = await axios.get<RatingProps>(
        `http://127.0.0.1:8000/ratings/get-avg-rating/${id}`
      );
      setRating(response.data);
    } catch (error) {
      console.error("Ошибка при получении рейтинга:", error);
    }
  };

  const deleteMessage = async () => {
    if (!notificationId || selectedProjectId === null) return;

    localStorage.removeItem(`notification_${id}_${selectedProjectId}`)

    try {
      await axios.delete(
        `http://127.0.0.1:8000/notifications/delete-notification/${notificationId}`
      );

      setNotificationId(null);
      setIsSending(false);
      alert("Заявка отменена");
    } catch (error) {
      console.error("Ошибка при отмене:", error);
      alert("Не удалось отменить заявку");
    }
  };

  const handleProjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newProjectId = Number(e.target.value);
    setSelectedProjectId(newProjectId);
  };

  return (
    <div className={styles["main"]}>
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
            <p>{Number(budget).toLocaleString("ru-RU")} ₽</p>
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
                onChange={handleProjectChange}
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
            <Button
              className={styles["button_product"]}
              onClick={postMessage}
            >
              Сотрудничать
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}