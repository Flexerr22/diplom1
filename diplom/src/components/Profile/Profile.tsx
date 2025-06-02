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
    const { name, value, files } = event.target;

    if (name === "avatar" && files && files[0]) {
      setFile(files[0]);
    } else {
      setUserEditData((prev) => ({ ...prev, [name]: value }));
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

      // Загружаем имена для всех отправителей
      const ratingsWithSenders = await Promise.all(
        response.data.map(async (ratingItem) => {
          try {
            const senderResponse = await axios.get<ProfileInfo>(
              `http://127.0.0.1:8000/users/${ratingItem.sender_id}`
            );
            return {
              ...ratingItem,
              senderName: senderResponse.data.name,
            };
          } catch (error) {
            console.error("Ошибка при получении имени отправителя:", error);
            return {
              ...ratingItem,
              senderName: "Неизвестный пользователь",
            };
          }
        })
      );

      setRating(ratingsWithSenders);
      console.log("Ratings with sender names:", ratingsWithSenders);
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
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Обновленные данные:", response.data);

      // Обновляем состояние
      setUserData((prev) => ({
        ...prev,
        ...response.data,
      }));
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
                <input
                  name="avatar"
                  type="file"
                  accept="image/*"
                  onChange={handleChange}
                  className={styles["input"]}
                />
              ) : (
                <img
                  src={`http://127.0.0.1:8000/${userData.avatar}`}
                  width={100}
                  height={100}
                  alt="Фото пользователя"
                />
              )}
            </div>
            <div className={styles.profile_rating}>
              <p>Ваш рейтинг</p>
              {ratingAvg?.average_rating ? (
                <div className={styles.rating_avg}>
                  <p>{ratingAvg.average_rating}</p>
                  <span>★</span>
                </div>
              ) : (
                ""
              )}
            </div>
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
                <label>Опыт работы:</label>
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
                  <p>{userData.experience}</p>
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
                <label>Бюджет:</label>
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
                  <p>{userData.budget}</p>
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

          <div className={styles.rating_block}>
            <p>Ваши отзывы</p>
            {rating.length > 0 ? (
              <div className={styles.sliderContainer}>
                <button onClick={prevSlide} className={styles.sliderButton}>
                  <CircleArrowLeft />
                </button>
                <div className={styles.sliderContent}>
                  <div className={styles.rating}>
                    <div className={styles.user_rating}>
                      <p>{rating[currentSlide].senderName}</p>
                      <div className={styles.rating_avg1}>
                        <p>{rating[currentSlide].amount}</p>
                        <span>★</span>
                      </div>
                    </div>
                    <p>{rating[currentSlide].review}</p>
                  </div>
                </div>
                <button onClick={nextSlide} className={styles.sliderButton}>
                  <CircleArrowRight />
                </button>
              </div>
            ) : (
              <p>Пока нет отзывов</p>
            )}
            {rating.length > 1 && (
              <div className={styles.sliderDots}>
                {rating.map((_, index) => (
                  <span
                    key={index}
                    className={`${styles.dot} ${
                      index === currentSlide ? styles.activeDot : ""
                    }`}
                    onClick={() => setCurrentSlide(index)}
                  />
                ))}
              </div>
            )}
          </div>

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
