import axios, { AxiosError } from "axios";
import styles from "./Profile.module.css";
import Cookies from "js-cookie";
import { ModalType } from "../Header/Header";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { ProfileInfo } from "../../types/user.props";
import { useNavigate } from "react-router-dom";
import { RatingAllProps } from "../../types/rating_all.props";
import { RatingProps } from "../../types/rating.props";
import { CircleArrowLeft, CircleArrowRight } from "lucide-react";

interface LoginComponentProps {
  setIsAuth: (value: boolean) => void;
  closeModal: () => void;
  setActiveModal: (value: ModalType) => void;
}

interface RatingWithSender extends RatingAllProps {
  senderName: string;
  senderAvatar: string | null; // Добавляем поле для аватара
}

export function Profile({
  setIsAuth,
  closeModal,
  setActiveModal,
}: LoginComponentProps) {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userData, setUserData] = useState<ProfileInfo | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [rating, setRating] = useState<RatingWithSender[]>([]);
  const [ratingAvg, setRatingAvg] = useState<RatingProps | null>(null);
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [userEditData, setUserEditData] = useState<ProfileInfo>({
    email: "",
    name: "",
    avatar: "",
    description: "",
    specialization: "",
    experience: "",
    skills: "",
    budget: "",
    investmentFocus: "",
  });

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === rating.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? rating.length - 1 : prev - 1));
  };

  // Списки для выпадающих списков
  const specializations = [
    "Программирование",
    "Дизайн",
    "Маркетинг",
    "Финансы",
    "Образование",
    "Медицина",
    "Искусство",
    "Строительство",
    "Наука",
    "Спорт",
  ];

  const investmentFocuses = [
    "Технологии",
    "Недвижимость",
    "Здравоохранение",
    "Образование",
    "Энергетика",
    "Транспорт",
    "Сельское хозяйство",
    "Финансовые услуги",
    "Розничная торговля",
    "Искусство и культура",
  ];

  useEffect(() => {
    getRating();
    getRatingAvg();
    getUserProfile();
  }, []);

  const deleteProfile = async () => {
    try {
      await axios.post("http://127.0.0.1:8000/users/logout");
      Cookies.remove("jwt");
      Cookies.remove("role");
      setIsAuth(false);
      closeModal();
      navigate("/");
    } catch (e) {
      if (e instanceof AxiosError) {
        console.log("Ошибка");
      }
    }
  };

  const validateInput = (value: string): boolean => {
    // Проверка на недопустимые символы
    const regex = /^[a-zA-Zа-яА-Я0-9\s.,:%!?()@_-]*$/;
    if (!regex.test(value)) {
      setError(
        "Недопустимые символы. Разрешены только буквы, цифры, пробелы и @_."
      );
      return false;
    }

    // Проверка на множественные пробелы
    if (/\s{2,}/.test(value)) {
      setError("Нельзя вводить более одного пробела подряд.");
      return false;
    }

    // Проверка, что есть хотя бы один не-пробельный символ
    if (/^\s*$/.test(value) && value !== "") {
      setError("Введите хотя бы один символ (не пробел)");
      return false;
    }

    setError(null);
    return true;
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = event.target;

    if (name === "avatar" && files && files[0]) {
      const selectedFile = files[0];
      setFile(selectedFile);

      // Создаем превью для изображения
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleClickOutside = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setActiveModal(null);
    }
  };

  const getRating = async () => {
  const jwt = Cookies.get("jwt");
  if (!jwt) {
    console.error("JWT-токен отсутствует");
    return;
  }

  try {
    const decoded = jwtDecode<{ sub: string }>(jwt);
    const user_id = decoded.sub;

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

  const getRatingAvg = async () => {
    const jwt = Cookies.get("jwt");
    if (!jwt) {
      console.error("JWT-токен отсутствует");
      return;
    }
    try {
      const decoded = jwtDecode<{ sub: string }>(jwt);
      const user_id = decoded.sub;
      const responce = await axios.get<RatingProps>(
        `http://127.0.0.1:8000/ratings/get-avg-rating/${user_id}`
      );
      setRatingAvg(responce.data);
      console.log(responce.data);
    } catch (error) {
      console.error(error);
    }
  };

  const getUserProfile = async () => {
    const jwt = Cookies.get("jwt");
    if (!jwt) {
      console.error("JWT-токен отсутствует");
      return;
    }

    try {
      const decoded = jwtDecode<{ sub: string }>(jwt);
      const user_id = decoded.sub;

      const response = await axios.get<ProfileInfo>(
        `http://127.0.0.1:8000/users/${user_id}`
      );
      setUserData(response.data);
      setUserEditData(response.data);
    } catch (error) {
      console.error("Ошибка при получении данных профиля:", error);
    }
  };

  const handleEditProfile = async () => {
    const jwt = Cookies.get("jwt");
    if (!jwt) {
      console.error("JWT-токен отсутствует");
      return;
    }

    // Проверка обязательных полей
    const requiredFields: { [key: string]: (keyof ProfileInfo)[] } = {
      mentor: [
        "name",
        "email",
        "description",
        "specialization",
        "experience",
        "skills",
      ],
      investor: ["name", "email", "description", "budget", "investmentFocus"],
      entrepreneur: ["name", "email", "description", "specialization"],
    };

    const role = Cookies.get("role") || "";
    const fieldsToCheck = requiredFields[role] || [];

    // Собираем список незаполненных полей
    const emptyFields = fieldsToCheck.filter(
      (field) => !userEditData[field] || userEditData[field]?.trim() === ""
    );

    if (emptyFields.length > 0) {
      // Преобразуем названия полей в читаемый формат
      const fieldNames: Record<string, string> = {
        name: "Имя",
        email: "Email",
        description: "Описание",
        specialization: "Специализация",
        experience: "Опыт работы",
        skills: "Навыки",
        budget: "Бюджет",
        investmentFocus: "Направление инвестиций",
      };

      const errorMessage = `Пожалуйста, заполните следующие обязательные поля:\n${emptyFields
        .map((field) => `- ${fieldNames[field] || field}`)
        .join("\n")}`;

      alert(errorMessage);
      return;
    }

    try {
      const decoded = jwtDecode<{ sub: string }>(jwt);
      const user_id = decoded.sub;
      
      const formData = new FormData();

      // Добавляем файл, если он есть
      if (file) {
        formData.append("avatar", file);
        console.log("Файл добавлен в FormData");
      } else {
        console.log("Файл отсутствует");
      }

      // Добавляем остальные поля
      formData.append("name", userEditData.name || "");
      formData.append("email", userEditData.email || "");
      formData.append("description", userEditData.description || "");
      formData.append("specialization", userEditData.specialization || "");
      formData.append("experience", userEditData.experience || "");
      formData.append("skills", userEditData.skills || "");
      formData.append("budget", userEditData.budget || "");
      formData.append("investmentFocus", userEditData.investmentFocus || "");

      const response = await axios.patch<ProfileInfo>(
        `http://127.0.0.1:8000/users/update-user/${user_id}`,
        formData
      );

      console.log("Обновленные данные:", response.data);

      // Обновляем состояние
      setUserData((prev) => ({
        ...prev,
        ...response.data,
      }));
      setPreviewImage(null);
    setFile(null); // Очищаем состояние файла
    setIsEditing(false);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Ошибка сервера:", error.response?.data);
      } else {
        console.error("Неизвестная ошибка:", error);
      }
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    // Проверка на специальные символы
    if (!validateInput(value)) {
      setError(
        "Недопустимые символы. Разрешены только буквы, цифры и пробелы."
      );
      return;
    }

    // Убираем лишние пробелы и сохраняем как строку
    const trimmedValue = value.replace(/\s+/g, " ");

    setError(null);
    setUserEditData((prev) => ({
      ...prev,
      [name]: trimmedValue,
    }));
  };

  useEffect(() => {
    const role = Cookies.get("role");
    const jwt = Cookies.get("jwt");

    if (role) {
      setUserRole(role);
    }
    if (jwt) {
      getUserProfile();
    }
  }, []);

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles["modal_main"]} onClick={handleClickOutside}>
      <div className={styles["modal_secondary"]}>
        <div className={styles.profile}>
          {error && <div className={styles.error}>{error}</div>}
          <div className={styles.profile_info_block}>
            <div className={styles.profile_info}>
              {isEditing ? (
                <label className={styles.upload_container}>
                  <input
                    name="avatar"
                    type="file"
                    accept="image/*"
                    onChange={handleChange}
                    className={styles.file_input}
                  />
                  <div className={styles.avatar_preview}>
                    {previewImage ? (
                      <img
                        src={previewImage}
                        alt="Предпросмотр аватара"
                        className={styles.avatar_image}
                      />
                    ) : userData?.avatar ? (
                      <img
                        src={`http://127.0.0.1:8000/${userData.avatar}`}
                        alt="Текущий аватар"
                        className={styles.avatar_image}
                      />
                    ) : (
                      <div className={styles.upload_placeholder}>
                        <span className={styles.plus_icon}>+</span>
                        <span className={styles.upload_text}>Добавить фото</span>
                      </div>
                    )}
                  </div>
                </label>
              ) : (
                <div className={styles.avatar_display}>
                  {userData?.avatar ? (
                    <img
                      src={`http://127.0.0.1:8000/${userData.avatar}`}
                      alt="Аватар пользователя"
                      className={styles.avatar_image}
                    />
                  ) : (
                    <div className={styles.default_avatar}>
                      <span className={styles.default_icon}>👤</span>
                    </div>
                  )}
                </div>
              )}
            </div>
            {(userRole === 'mentor' || userRole === 'investor') && 
               <div className={styles.profile_rating}>
                  <p>Ваш рейтинг</p>
                  {ratingAvg?.average_rating ? (
                    <div className={styles.rating_avg}>
                      <p>{ratingAvg.average_rating}</p>
                      <span>★</span>
                    </div>
                  ) : (
                    "Пока нет рейтинга"
                  )}
                </div>
            }
          </div>
          <div>
            <div className={styles.profile_info}>
              <label>Ваш email</label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={userEditData.email || ""}
                  onChange={handleInputChange}
                  maxLength={30}
                />
              ) : (
                <p>{userData.email}</p>
              )}
            </div>
            <div className={styles.profile_info}>
              <label>Ваше имя</label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={userEditData.name || ""}
                  onChange={handleInputChange}
                  maxLength={15}
                />
              ) : (
                <p>{userData.name}</p>
              )}
            </div>
          </div>

          <div className={styles.profile_info}>
            <label>Описание:</label>
            {isEditing ? (
              <textarea
                name="description"
                value={userEditData.description || ""}
                onChange={handleInputChange}
                maxLength={255}
                required
              />
            ) : (
              <textarea>{userData.description}</textarea>
            )}
          </div>
          <div className={styles.profile_info}>
            <label>Специализация:</label>
            {isEditing ? (
              <select
                name="specialization"
                value={userEditData.specialization || ""}
                onChange={handleInputChange}
                required
              >
                <option value="" disabled>
                  Выберите специализацию
                </option>
                {specializations.map((specialization, index) => (
                  <option key={index} value={specialization}>
                    {specialization}
                  </option>
                ))}
              </select>
            ) : (
              <p>{userData.specialization}</p>
            )}
          </div>

          {userRole === "mentor" && (
            <>
              <div className={styles.profile_info}>
                <label>Опыт работы ( в мес. ):</label>
                {isEditing ? (
                  <input
                    type="number"
                    name="experience"
                    value={userEditData.experience || ""}
                    onChange={handleInputChange}
                    maxLength={30}
                    required
                  />
                ) : (
                  <p>{userData.experience} мес.</p>
                )}
              </div>
              <div className={styles.profile_info}>
                <label>Навыки:</label>
                {isEditing ? (
                  <textarea
                    name="skills"
                    value={userEditData.skills}
                    onChange={handleInputChange}
                    maxLength={50}
                    required
                  />
                ) : (
                  <textarea>{userData.skills}</textarea>
                )}
              </div>
            </>
          )}

          {userRole === "investor" && (
            <>
              <div className={styles.profile_info}>
                <label>Бюджет ( в руб. ):</label>
                {isEditing ? (
                  <input
                    type="number"
                    name="budget"
                    value={userEditData.budget || ""}
                    onChange={handleInputChange}
                    maxLength={15}
                    required
                  />
                ) : (
                  <p>
                    {Number(userData.budget).toLocaleString('ru-RU')} ₽
                  </p>
                )}
              </div>
              <div className={styles.profile_info}>
                <label>Направление инвестиций:</label>
                {isEditing ? (
                  <select
                    name="investmentFocus"
                    value={userEditData.investmentFocus || ""}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="" disabled>
                      Выберите направление
                    </option>
                    {investmentFocuses.map((focus, index) => (
                      <option key={index} value={focus}>
                        {focus}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p>{userData.investmentFocus}</p>
                )}
              </div>
            </>
          )}
          {(userRole === 'mentor' || userRole === 'investor') && (
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
          )}

          {isEditing ? (
            <>
              <button
                className={styles.profile_button}
                onClick={handleEditProfile}
              >
                Сохранить изменения
              </button>
              <button
                className={styles.profile_button}
                onClick={() => setIsEditing(false)}
              >
                Отмена
              </button>
            </>
          ) : (
            <button
              className={styles.profile_button}
              onClick={() => setIsEditing(true)}
            >
              Редактировать профиль
            </button>
          )}
          <button className={styles.profile_button} onClick={deleteProfile}>
            Выйти из аккаунта
          </button>
        </div>
      </div>
    </div>
  );
}
