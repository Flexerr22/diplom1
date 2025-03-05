import { useEffect, useState } from "react";
import { ProfileInfo } from "../Profile/Profile";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Container } from "../Container/Container";
import styles from "./UserInfo.module.css"; // Создайте файл стилей UserInfo.module.css
import Header from "../Header/Header";

export function UserInfo() {
  const { user_id } = useParams<{ user_id: string }>();
  const [user, setUser] = useState<ProfileInfo | null>(null);

  useEffect(() => {
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
          <h2>{user.name}</h2>
          <div className={styles.form}>
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
              {user.contact && (
                <div className={styles.field}>
                  <label>Контактная информация:</label>
                  <input
                    type="text"
                    value={user.contact}
                    readOnly
                    className={styles.input}
                    placeholder="Контактная информация"
                  />
                </div>
              )}
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

            {user.portfolio && user.portfolio.length > 0 && (
              <div>
                <p>Портфолио</p>
                <div className={styles.textareas}>
                  {user.portfolio.map((item, index) => (
                    <div key={index} className={styles.field}>
                      <label>Проект {index + 1}:</label>
                      <textarea
                        value={item}
                        readOnly
                        className={styles.textarea}
                        placeholder="Проект"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </Container>
    </>
  );
}
