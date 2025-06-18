import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Container } from "../Container/Container";
import styles from "./UserInfo.module.css";
import Header from "../Header/Header";
import { ProjectLast } from "../ProjectLast/ProjectLast";
import { ProductProps } from "../../types/projects.props";
import { ProfileInfo } from "../../types/user.props";
import {
  CircleArrowLeft,
  CircleArrowRight,
  CircleCheckBig,
} from "lucide-react";
import { RatingAllProps } from "../../types/rating_all.props";
import Button from "../Button/Button";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { MessageProps } from "../../types/message.props";
import { Footer } from "../Footer/Footer";

interface RatingWithSender extends RatingAllProps {
  senderName: string;
  senderAvatar: string | null;
}

export function UserInfo() {
  const { user_id } = useParams<{ user_id: string }>();
  const [user, setUser] = useState<ProfileInfo | null>(null);
  const [projects, setProjects] = useState<ProductProps[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [rating, setRating] = useState<RatingWithSender[]>([]);
  const [isAdd, setIsAdd] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isAccept, setIsAccept] = useState(false);
  const [isReject, setIsReject] = useState(false);
  const [notificationId, setNotificationId] = useState<number | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(
    null
  );
  const [userProjects, setUserProjects] = useState<ProductProps[]>([]); // Проекты текущего пользователя

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === rating.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? rating.length - 1 : prev - 1));
  };

  const formatNumber = (value: number | string): string => {
    const numberValue = typeof value === "string" ? parseFloat(value) : value;
    if (isNaN(numberValue)) {
      return value.toString();
    }
    return numberValue.toLocaleString("ru-RU", {
      maximumFractionDigits: 2,
    });
  };

  // Получаем проекты текущего авторизованного пользователя
  const getCurrentUserProjects = async () => {
    const jwt = Cookies.get("jwt");
    if (!jwt) return;

    try {
      const decoded = jwtDecode<{ sub: string }>(jwt);
      const current_user_id = parseInt(decoded.sub, 10);

      const response = await axios.get<ProductProps[]>(
        `http://127.0.0.1:8000/projects/my-projects/${current_user_id}`
      );
      setUserProjects(response.data);

      if (response.data.length > 0) {
        setSelectedProjectId(response.data[0].id);
      }
    } catch (error) {
      console.error(
        "Ошибка при получении проектов текущего пользователя:",
        error
      );
    }
  };

  // Проверяем существующее уведомление
  const checkExistingNotification = async () => {
    const jwt = Cookies.get("jwt");
    if (!jwt || selectedProjectId === null) return;

    try {
      const decoded = jwtDecode<{ sub: string }>(jwt);
      const current_user_id = parseInt(decoded.sub, 10);

      const response = await axios.get<MessageProps[]>(
        `http://127.0.0.1:8000/notifications/user-notifications/${current_user_id}`
      );

      const existingNotification = response.data.find(
        (notif) =>
          notif.project_id === selectedProjectId &&
          notif.recipient_id === Number(user_id)
      );

      const storageKey = `notification_${user_id}_${selectedProjectId}`;

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

  // Проверяем уведомление в localStorage
  const checkLocalStorageNotification = () => {
    if (selectedProjectId === null) return;

    const storageKey = `notification_${user_id}_${selectedProjectId}`;
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

  useEffect(() => {
    const favorites = JSON.parse(
      localStorage.getItem("favorites_user") || "[]"
    );
    setIsAdd(favorites.includes(Number(user_id)));

    const getMyProject = async () => {
      try {
        const response = await axios.get<ProductProps[]>(
          `http://127.0.0.1:8000/projects/my-projects/${user_id}`
        );
        setProjects(response.data);
      } catch (error) {
        console.error("Ошибка при загрузке проекта:", error);
      }
    };

    const getUserById = async () => {
      try {
        const response = await axios.get<ProfileInfo>(
          `http://127.0.0.1:8000/users/${user_id}`
        );
        setUser(response.data);
      } catch (error) {
        console.error("Ошибка при загрузке пользователя:", error);
      }
    };

    getMyProject();
    getRating();
    getUserById();
    getCurrentUserProjects(); // Загружаем проекты текущего пользователя
  }, [user_id]);

  useEffect(() => {
    if (selectedProjectId !== null) {
      checkExistingNotification();
      checkLocalStorageNotification();
    }
  }, [selectedProjectId, user_id]);

  const deleteMessage = async () => {
    const jwt = Cookies.get("jwt");
    if (!jwt || !notificationId || selectedProjectId === null) return;

    try {
      await axios.delete(
        `http://127.0.0.1:8000/notifications/delete-notification/${notificationId}`
      );

      const storageKey = `notification_${user_id}_${selectedProjectId}`;
      localStorage.removeItem(storageKey);

      setIsSending(false);
      setNotificationId(null);
      alert("Запрос отменен!");
    } catch (error) {
      console.error("Ошибка при отмене запроса:", error);
      alert("Не удалось отменить запрос");
    }
  };

  const getRating = async () => {
    try {
      const response = await axios.get<RatingAllProps[]>(
        `http://127.0.0.1:8000/ratings/get-all-ratings/${user_id}`
      );

      const ratingsWithSenders = await Promise.all(
        response.data.map(async (ratingItem) => {
          try {
            const senderResponse = await axios.get<ProfileInfo>(
              `http://127.0.0.1:8000/users/${ratingItem.sender_id}`
            );
            return {
              ...ratingItem,
              senderName: senderResponse.data.name,
              senderAvatar: senderResponse.data.avatar,
            };
          } catch (error) {
            console.error("Ошибка при получении данных отправителя:", error);
            return {
              ...ratingItem,
              senderName: "Неизвестный пользователь",
              senderAvatar: null,
            };
          }
        })
      );

      setRating(ratingsWithSenders);
    } catch (error) {
      console.error("Ошибка при получении оценок:", error);
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
        `http://127.0.0.1:8000/mentors-investors/favorites/add-to-favorites/${current_user_id}/${user_id}?favorite_user_id=${user_id}`
      );
      setIsAdd(true);

      const favorites = JSON.parse(
        localStorage.getItem("favorites_user") || "[]"
      );
      if (!favorites.includes(Number(user_id))) {
        favorites.push(Number(user_id));
        localStorage.setItem("favorites_user", JSON.stringify(favorites));
      }
    } catch (error) {
      console.error("Ошибка сервера:", error);
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

      if (sender_id === Number(user_id)) {
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
        recipient_id: Number(user_id),
        sender_id,
        status: "pending",
        text: `Пользователь ${userResponse.data.name} хочет сотрудничать по проекту "${projectResponse.data.title}"`,
      };

      const response = await axios.post<MessageProps>(
        `http://127.0.0.1:8000/notifications/send-notification/${user_id}`,
        notificationData
      );

      const storageKey = `notification_${user_id}_${selectedProjectId}`;
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

  const handleProjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newProjectId = Number(e.target.value);
    setSelectedProjectId(newProjectId);
  };

  if (!user) {
    return <div>Загрузка...</div>;
  }

  return (
    <>
      <Header />
      <Container>
        <div className={styles.main}>
          <div className={styles.form}>
            <div className={styles.username}>
              <h2>Имя:</h2>
              <h2>{user.name}</h2>
            </div>
            <div className={styles.main_info}>
              <b>Основная информация</b>
              <div className={styles.field}>
                <label>Описание:</label>
                <textarea
                  value={user.description}
                  readOnly
                  className={styles.textarea}
                  placeholder="Описание"
                />
              </div>
            </div>

            <div className={styles.main_details}>
              <b>Детали профиля</b>
              <div className={styles.inputs}>
                {user.specialization && (
                  <div className={styles.field}>
                    <label>Специализация:</label>
                    <input
                      type="text"
                      value={user.specialization}
                      readOnly
                      className={styles.input}
                      placeholder="Специализация"
                    />
                  </div>
                )}
                {user.experience && (
                  <div className={styles.field}>
                    <label>Опыт (в мес.):</label>
                    <input
                      type="text"
                      value={`${user.experience} мес.`}
                      readOnly
                      className={styles.input}
                      placeholder="Опыт"
                    />
                  </div>
                )}
                {user.skills && (
                  <div className={styles.field}>
                    <label>Навыки:</label>
                    <textarea
                      value={user.skills}
                      readOnly
                      className={styles.input}
                      placeholder="Навыки"
                    />
                  </div>
                )}
                {user.budget && (
                  <div className={styles.field}>
                    <label>Бюджет (в руб.):</label>
                    <input
                      type="text"
                      value={`${formatNumber(user.budget)} ₽`}
                      readOnly
                      className={styles.input}
                      placeholder="Бюджет"
                    />
                  </div>
                )}
                {user.investmentFocus && (
                  <div className={styles.field}>
                    <label>Фокус инвестиций:</label>
                    <input
                      type="text"
                      value={user.investmentFocus}
                      readOnly
                      className={styles.input}
                      placeholder="Фокус инвестиций"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className={styles.actions}>
            {isAdd ? (
              <CircleCheckBig className={styles.favoriteIcon} />
            ) : (
              <Button className={styles.button_product} onClick={addFavourites}>
                Добавить в избранное
              </Button>
            )}

            {/* Добавляем выбор проекта текущего пользователя */}
            {userProjects.length > 0 && (
              <>
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

                {isAccept ? (
                  <div className={styles.statusMessage}>Заявка принята</div>
                ) : isReject ? (
                  <div className={styles.statusMessage}>Заявка отклонена</div>
                ) : isSending ? (
                  <Button
                    className={styles.button_product}
                    onClick={deleteMessage}
                  >
                    Отменить заявку
                  </Button>
                ) : (
                  <Button
                    className={styles.button_product}
                    onClick={postMessage}
                  >
                    Сотрудничать
                  </Button>
                )}
              </>
            )}
          </div>
          <div className={styles.rating_block}>
            <h3>Отзывы</h3>
            {rating.length > 0 ? (
              <div className={styles.reviewsContainer}>
                <button onClick={prevSlide} className={styles.navButton}>
                  <CircleArrowLeft />
                </button>

                <div className={styles.reviewCard}>
                  <div className={styles.reviewHeader}>
                    {rating[currentSlide].senderAvatar ? (
                      <img
                        src={`http://127.0.0.1:8000/${rating[currentSlide].senderAvatar}`}
                        alt={`Аватар ${rating[currentSlide].senderName}`}
                        className={styles.senderAvatar}
                        width={50}
                        height={50}
                      />
                    ) : (
                      <div className={styles.avatarPlaceholder}>
                        {rating[currentSlide].senderName
                          .charAt(0)
                          .toUpperCase()}
                      </div>
                    )}
                    <div>
                      <h4>{rating[currentSlide].senderName}</h4>
                      <div className={styles.ratingStars}>
                        {"★".repeat(Math.floor(rating[currentSlide].amount))}
                        {"☆".repeat(
                          5 - Math.floor(rating[currentSlide].amount)
                        )}
                      </div>
                    </div>
                  </div>
                  <div className={styles.reviewText}>
                    "{rating[currentSlide].review}"
                  </div>
                </div>

                <button onClick={nextSlide} className={styles.navButton}>
                  <CircleArrowRight />
                </button>
              </div>
            ) : (
              <p className={styles.noReviews}>Пока нет отзывов</p>
            )}

            {rating.length > 1 && (
              <div className={styles.dotsContainer}>
                {rating.map((_, index) => (
                  <button
                    key={index}
                    className={`${styles.dot} ${
                      index === currentSlide ? styles.activeDot : ""
                    }`}
                    onClick={() => setCurrentSlide(index)}
                    aria-label={`Перейти к отзыву ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
          <b className={styles.title}>Последние успешные проекты</b>
          {projects.length > 0 ? (
            <div className={styles["products"]}>
              {projects.map((item, index) => (
                <ProjectLast
                  key={index}
                  id={item.id}
                  title={item.title}
                  tagline={item.tagline}
                  investment={item.investment}
                  category={item.category}
                  budget={item.budget}
                  experience={item.experience}
                  role={item.role}
                  description={item.description}
                  skills={item.skills}
                  user_id={item.user_id}
                />
              ))}
            </div>
          ) : (
            <p className={styles.noReviews}>
              Пользователь пока не добавил последние успешные проекты
            </p>
          )}
        </div>
      </Container>
      <Footer />
    </>
  );
}
