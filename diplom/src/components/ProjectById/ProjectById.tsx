import styles from "./ProjectById.module.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../Header/Header";
import { Container } from "../Container/Container";
import { CreateProjectRequest } from "../../types/projects.props";
import { MessageProps } from "../../types/message.props";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import Button from "../Button/Button";
import { CircleCheckBig } from "lucide-react";
import { Footer } from "../Footer/Footer";

export function ProjectById() {
  const { project_id } = useParams<{ project_id: string }>();
  const [project, setProject] = useState<CreateProjectRequest | null>(null);
  const [isAdd, setIsAdd] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isAccept, setIsAccept] = useState(false);
  const [isReject, setIsReject] = useState(false);
  const [notificationId, setNotificationId] = useState<number | null>(null);

  const formatNumber = (value: number | string): string => {
    const numberValue = typeof value === "string" ? parseFloat(value) : value;

    if (isNaN(numberValue)) {
      return value.toString();
    }

    return numberValue.toLocaleString("ru-RU", {
      maximumFractionDigits: 2,
    });
  };

  useEffect(() => {
    const getProjectById = async () => {
      try {
        const response = await axios.get<CreateProjectRequest>(
          `http://127.0.0.1:8000/projects/${project_id}`
        );
        setProject(response.data);

        // Check favorites status
        const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
        setIsAdd(favorites.includes(String(response.data.id)));

        // Проверяем статус заявки из localStorage, если пользователь авторизован
        const jwt = Cookies.get("jwt");
        if (jwt && response.data) {
          const storageKey = `project_notification_${response.data.user_id}_${response.data.id}`;
          const notificationData = localStorage.getItem(storageKey);

          if (notificationData) {
            const { status, notificationId } = JSON.parse(notificationData);
            setNotificationId(notificationId);
            setIsSending(status === "pending");
            setIsAccept(status === "accepted");
            setIsReject(status === "rejected");
          }
        }
      } catch (error) {
        console.error("Ошибка при загрузке проекта:", error);
      }
    };

    getProjectById();
  }, [project_id]);

  const addFavourites = async () => {
    const jwt = Cookies.get("jwt");
    if (!jwt) {
      console.error("JWT-токен отсутствует");
      return;
    }

    if (!project) return;

    const decoded = jwtDecode<{ sub: string }>(jwt);
    const current_user_id = parseInt(decoded.sub, 10);

    try {
      await axios.post(
        `http://127.0.0.1:8000/users/favorites/add-to-favorites/${current_user_id}/${project.id}`
      );
      setIsAdd(true);

      const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
      const projectIdStr = String(project.id);
      if (!favorites.includes(projectIdStr)) {
        favorites.push(projectIdStr);
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

      if (!project) return;

      if (sender_id === project.user_id) {
        alert("Нельзя отправить запрос самому себе!");
        return;
      }

      const userResponse = await axios.get(
        `http://127.0.0.1:8000/users/${sender_id}`
      );

      const notificationData = {
        project_id: project.id,
        recipient_id: project.user_id,
        sender_id,
        status: "pending",
        text: `Пользователь ${userResponse.data.name} хочет сотрудничать по проекту "${project.title}"`,
      };

      const response = await axios.post<MessageProps>(
        `http://127.0.0.1:8000/notifications/send-notification/${project.user_id}`,
        notificationData
      );

      // Сохраняем статус заявки в localStorage
      const storageKey = `project_notification_${project.user_id}_${project.id}`;
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

  const deleteMessage = async () => {
    if (!notificationId || !project) return;

    try {
      await axios.delete(
        `http://127.0.0.1:8000/notifications/delete-notification/${notificationId}`
      );

      // Удаляем статус заявки из localStorage
      const storageKey = `project_notification_${project.user_id}_${project.id}`;
      localStorage.removeItem(storageKey);

      setNotificationId(null);
      setIsSending(false);
      alert("Заявка отменена");
    } catch (error) {
      console.error("Ошибка при отмене:", error);
      alert("Не удалось отменить заявку");
    }
  };

  if (!project) {
    return <div>Загрузка...</div>;
  }

  return (
    <>
      <Header />
      <Container>
        <div className={styles.main}>
          <div className={styles.form}>
            <h2>{project.title}</h2>
            <div className={styles.main_info}>
              <p>Основная информация</p>
              <div className={styles.field}>
                <label>Описание:</label>
                <textarea
                  value={project.description}
                  readOnly
                  className={styles.textarea}
                  placeholder="Описание"
                />
              </div>
            </div>
            {project.tagline && (
              <>
                <div className={styles.main_details}>
                  <p>Основные детали проекта</p>

                  <div className={styles.field}>
                    <label>Краткое описание:</label>
                    <textarea
                      value={project.tagline}
                      readOnly
                      className={styles.textarea}
                      placeholder="Краткое описание"
                    />
                  </div>

                  <div className={styles.inputs}>
                    {project.category && (
                      <div className={styles.field}>
                        <label>Категория:</label>
                        <input
                          type="text"
                          value={project.category}
                          readOnly
                          className={styles.input}
                          placeholder="Категория"
                        />
                      </div>
                    )}
                    {project.stage && (
                      <div className={styles.field}>
                        <label>Стадия:</label>
                        <input
                          type="text"
                          value={project.stage}
                          readOnly
                          className={styles.input}
                          placeholder="Стадия"
                        />
                      </div>
                    )}
                    {project.links && (
                      <div className={styles.field}>
                        <label>Ссылки:</label>
                        <input
                          value={project.links}
                          readOnly
                          className={styles.textarea}
                          placeholder="Ссылки"
                        />
                      </div>
                    )}
                    {project.revenue && (
                      <div className={styles.field}>
                        <label>Выручка (в руб.):</label>
                        <input
                          type="text"
                          value={`${formatNumber(project.revenue)} ₽`}
                          readOnly
                          className={styles.input}
                          placeholder="Выручка"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
            {project.investment && (
              <>
                <div>
                  <p>Для инвесторов</p>
                  <div className={styles.inputs}>
                    <div className={styles.field}>
                      <label>Инвестиции (в руб.):</label>
                      <input
                        type="text"
                        value={`${formatNumber(project.investment)} ₽`}
                        readOnly
                        className={styles.input}
                        placeholder="Инвестиции"
                      />
                    </div>
                    {project.equity && (
                      <div className={styles.field}>
                        <label>Доля:</label>
                        <input
                          type="text"
                          value={`${project.equity} %`}
                          readOnly
                          className={styles.input}
                          placeholder="Доля"
                        />
                      </div>
                    )}
                    {project.investmentType && (
                      <div className={styles.field}>
                        <label>Тип инвестиций:</label>
                        <input
                          type="text"
                          value={project.investmentType}
                          readOnly
                          className={styles.input}
                          placeholder="Тип инвестиций"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
            {project.mentorExperience && (
              <>
                <div>
                  <p>Ожидания от наставника</p>
                  <div className={styles.inputs}>
                    <div className={styles.field}>
                      <label>Опыт ментора (в мес.):</label>
                      <input
                        type="text"
                        value={`${project.mentorExperience} мес.`}
                        readOnly
                        className={styles.input}
                        placeholder="Опыт ментора"
                      />
                    </div>

                    {project.mentorSkills && (
                      <div className={styles.field}>
                        <label>Навыки ментора:</label>
                        <input
                          type="text"
                          value={project.mentorSkills}
                          readOnly
                          className={styles.input}
                          placeholder="Навыки ментора"
                        />
                      </div>
                    )}
                    {project.mentorWorkFormat && (
                      <div className={styles.field}>
                        <label>Формат работы:</label>
                        <input
                          type="text"
                          value={project.mentorWorkFormat}
                          readOnly
                          className={styles.input}
                          placeholder="Формат работы"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {project.typeOfMentoring && (
              <div>
                <p>Информация о наставнике</p>
                <div className={styles.inputs}>
                  <div className={styles.field}>
                    <label>Тип менторства:</label>
                    <input
                      type="text"
                      value={project.typeOfMentoring}
                      readOnly
                      className={styles.input}
                      placeholder="Тип менторства"
                    />
                  </div>
                  {project.experience && (
                    <div className={styles.field}>
                      <label>Опыт (в мес.):</label>
                      <input
                        type="text"
                        value={`${project.experience} мес.`}
                        readOnly
                        className={styles.input}
                        placeholder="Опыт"
                      />
                    </div>
                  )}
                  {project.skills && (
                    <div className={styles.field}>
                      <label>Навыки:</label>
                      <input
                        type="text"
                        value={project.skills}
                        readOnly
                        className={styles.input}
                        placeholder="Навыки"
                      />
                    </div>
                  )}
                </div>
                {project.achievements && (
                  <div className={styles.field}>
                    <label>Достижения:</label>
                    <textarea
                      value={project.achievements}
                      readOnly
                      className={styles.textarea}
                      placeholder="Достижения"
                    />
                  </div>
                )}
              </div>
            )}
            {project.budget && (
              <>
                <div>
                  <p>Информация об инвесторе</p>
                  <div className={styles.inputs}>
                    <div className={styles.field}>
                      <label>Выделенный бюджет (в руб.):</label>
                      <input
                        type="text"
                        value={`${project.budget} ₽`}
                        readOnly
                        className={styles.input}
                        placeholder="Бюджет"
                      />
                    </div>
                  </div>
                  {project.results && (
                    <div className={styles.field}>
                      <label>Результаты:</label>
                      <textarea
                        value={project.results}
                        readOnly
                        className={styles.textarea}
                        placeholder="Результаты"
                      />
                    </div>
                  )}
                </div>
              </>
            )}
            <div className={styles.actions}>
              {isAdd ? (
                <CircleCheckBig className={styles.favorite_icon} />
              ) : (
                <Button
                  className={styles.button_product}
                  onClick={addFavourites}
                >
                  Добавить в избранное
                </Button>
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
                  className={styles.button_product}
                  onClick={deleteMessage}
                >
                  Отменить заявку
                </Button>
              ) : (
                <Button className={styles.button_product} onClick={postMessage}>
                  Сотрудничать
                </Button>
              )}
            </div>
          </div>
        </div>
      </Container>
      <Footer />
    </>
  );
}
