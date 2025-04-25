import { CircleCheckBig } from "lucide-react";
import Button from "../Button/Button";
import styles from "./RolesData.module.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import Cookies from "js-cookie";
import { ProductProps, RolesGroupProps } from "../../helpers/projects.props";
import { MessageProps } from "../../helpers/message.props";
import { RatingProps } from "../../helpers/rating.props";

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
    checkLocalNotification();
    getAll();
  }, [id]);

  const getLocalStorageKey = () => {
    return role === "mentor" ? "notification_mentor" : "notification_investor";
  };
  const checkLocalNotification = () => {
    const localNotification = localStorage.getItem(getLocalStorageKey());
    if (localNotification) {
      const { status, notificationId } = JSON.parse(localNotification);
      if (status == "pending") {
        setIsSending(true);
        setNotificationId(notificationId);
      }
    }
  };

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
          notif.recipient_id === id &&
          notif.status === "pending"
      );

      if (existingNotification) {
        setNotificationId(existingNotification.id);
        setIsSending(true);
      } else {
        setIsSending(false);
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
        getLocalStorageKey(),
        JSON.stringify({
          status: "pending",
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

      localStorage.removeItem(getLocalStorageKey());
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
            <p>{experience}</p>
          ) : role === "investor" ? (
            <p>{budget}</p>
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
          {isSending ? (
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
