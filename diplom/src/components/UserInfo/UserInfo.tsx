import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Container } from "../Container/Container";
import styles from "./UserInfo.module.css"; // Создайте файл стилей UserInfo.module.css
import Header from "../Header/Header";
import { ProjectLast } from "../ProjectLast/ProjectLast";
import { ProductProps } from "../../types/projects.props";
import { ProfileInfo } from "../../types/user.props";
import { CircleArrowLeft, CircleArrowRight } from "lucide-react";
import { RatingAllProps } from "../../types/rating_all.props";

interface RatingWithSender extends RatingAllProps {
  senderName: string;
  senderAvatar: string | null; // Добавляем поле для аватара
}

export function UserInfo() {
  const { user_id } = useParams<{ user_id: string }>();
  const [user, setUser] = useState<ProfileInfo | null>(null);
  const [projects, setProjects] = useState<ProductProps[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [rating, setRating] = useState<RatingWithSender[]>([])

  const nextSlide = () => {
  setCurrentSlide((prev) => (prev === rating.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? rating.length - 1 : prev - 1));
  };

  const formatNumber = (value: number | string): string => {
    // Если значение - строка, пытаемся преобразовать в число
    const numberValue = typeof value === 'string' 
      ? parseFloat(value) 
      : value;
    
    // Проверяем, является ли значение числом
    if (isNaN(numberValue)) {
      return value.toString();
    }
    
    // Форматируем число с разделителями тысяч
    return numberValue.toLocaleString('ru-RU', {
      maximumFractionDigits: 2
    });
  };

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
    getRating();
    getUserById();
  }, [user_id]);

  const getRating = async () => {

  try {

    const response = await axios.get<RatingAllProps[]>(
      `http://127.0.0.1:8000/ratings/get-all-ratings/${user_id}`
    );

    // Загружаем имена и аватары для всех отправителей
    const ratingsWithSenders = await Promise.all(
      response.data.map(async (ratingItem) => {
        try {
          const senderResponse = await axios.get<ProfileInfo>(
            `http://127.0.0.1:8000/users/${ratingItem.sender_id}`
          );
          return {
            ...ratingItem,
            senderName: senderResponse.data.name,
            senderAvatar: senderResponse.data.avatar // Добавляем аватар
          };
        } catch (error) {
          console.error("Ошибка при получении данных отправителя:", error);
          return {
            ...ratingItem,
            senderName: "Неизвестный пользователь",
            senderAvatar: null
          };
        }
      })
    );

    setRating(ratingsWithSenders);
    console.log("Ratings with sender data:", ratingsWithSenders);
  } catch (error) {
    console.error("Ошибка при получении оценок:", error);
  }
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
                        {rating[currentSlide].senderName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <h4>{rating[currentSlide].senderName}</h4>
                      <div className={styles.ratingStars}>
                        {'★'.repeat(Math.floor(rating[currentSlide].amount))}
                        {'☆'.repeat(5 - Math.floor(rating[currentSlide].amount))}
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
                    className={`${styles.dot} ${index === currentSlide ? styles.activeDot : ''}`}
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
          ): (
            <p className={styles.noReviews}>Пользователь пока не добавил последние успешные проекты</p>
          )}
        </div>
      </Container>
    </>
  );
}
