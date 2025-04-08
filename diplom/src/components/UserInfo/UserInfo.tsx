import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Container } from "../Container/Container";
import styles from "./UserInfo.module.css"; // Создайте файл стилей UserInfo.module.css
import Header from "../Header/Header";
import { ProjectLast } from "../ProjectLast/ProjectLast";
import { ProductProps } from "../../helpers/projects.props";
import { ProfileInfo } from "../../helpers/user.props";

export function UserInfo() {
  const { user_id } = useParams<{ user_id: string }>();
  const [user, setUser] = useState<ProfileInfo | null>(null);
  const [projects, setProjects] = useState<ProductProps[]>([]); // Используем массив

  useEffect(() => {
    const getMyProject = async () => {
      try {
        const response = await axios.get<ProductProps[]>(
          `http://127.0.0.1:8000/projects/my-projects/${user_id}`
        );
        console.log("Данные получены:", response.data); // Отладочный вывод
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
    getUserById();
  }, [user_id]);

  if (!user) {
    return <div>Загрузка...</div>;
  }

  return (
    <>
      <Header />
      <Container>
        <div className={styles.main}>
          <div className={styles.form}>
            <h2>{user.name}</h2>
            <div className={styles.main_info}>
              <p>Основная информация</p>
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
              <p>Детали профиля</p>
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
                    <label>Опыт:</label>
                    <input
                      type="text"
                      value={user.experience}
                      readOnly
                      className={styles.input}
                      placeholder="Опыт"
                    />
                  </div>
                )}
                {user.skills && (
                  <div className={styles.field}>
                    <label>Навыки:</label>
                    <input
                      type="text"
                      value={user.skills}
                      readOnly
                      className={styles.input}
                      placeholder="Навыки"
                    />
                  </div>
                )}
                {user.budget && (
                  <div className={styles.field}>
                    <label>Бюджет:</label>
                    <input
                      type="text"
                      value={user.budget}
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
          <b className={styles.title}>Последние успешные проекты</b>
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
              />
            ))}
          </div>
        </div>
      </Container>
    </>
  );
}
