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
  senderAvatar: string | null;
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

  // Навигация по отзывам
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === rating.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? rating.length - 1 : prev - 1));
  };

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
        console.log("Ошибка выхода");
      }
    }
  };

  const validateInput = (value: string, fieldName: string): boolean => {
    // Для числовых полей
    const numericFields = ["experience", "budget"];
    if (numericFields.includes(fieldName)) {
      const numValue = parseFloat(value);
      if (isNaN(numValue) && value !== "") return false;
      if (numValue < 0) {
        setError("Нельзя вводить отрицательные числа");
        return false;
      }
    }

    // Для текстовых полей
    const textRegex = /^[a-zA-Zа-яА-ЯёЁ0-9\s.,!?()%:\-@]*$/;
    if (!textRegex.test(value)) {
      setError(
        "Недопустимые символы. Разрешены только буквы, цифры и основные знаки препинания."
      );
      return false;
    }

    if (/\s{2,}/.test(value)) {
      setError("Нельзя вводить более одного пробела подряд");
      return false;
    }

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
    if (!jwt) return;

    try {
      const decoded = jwtDecode<{ sub: string }>(jwt);
      const user_id = decoded.sub;

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

  const getRatingAvg = async () => {
    const jwt = Cookies.get("jwt");
    if (!jwt) return;

    try {
      const decoded = jwtDecode<{ sub: string }>(jwt);
      const user_id = decoded.sub;
      const response = await axios.get<RatingProps>(
        `http://127.0.0.1:8000/ratings/get-avg-rating/${user_id}`
      );
      setRatingAvg(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const getUserProfile = async () => {
    const jwt = Cookies.get("jwt");
    if (!jwt) return;

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
      setError("Требуется авторизация");
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
    const emptyFields = fieldsToCheck.filter(
      (field) => !userEditData[field] || userEditData[field]?.trim() === ""
    );

    if (emptyFields.length > 0) {
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

      setError(errorMessage);
      return;
    }

    try {
      const decoded = jwtDecode<{ sub: string }>(jwt);
      const user_id = decoded.sub;

      const formData = new FormData();

      // Добавляем файл, если он есть
      if (file) {
        formData.append("avatar", file);
      }

      // Добавляем остальные поля
      Object.entries(userEditData).forEach(([key, value]) => {
        if (value !== undefined && value !== null && key !== "avatar") {
          formData.append(key, value.toString());
        }
      });

      // Добавляем заголовки для FormData
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${jwt}`,
        },
      };

      const response = await axios.patch<ProfileInfo>(
        `http://127.0.0.1:8000/users/update-user/${user_id}`,
        formData,
        config
      );

      // Обновляем состояние
      setUserData(response.data);
      setPreviewImage(null);
      setFile(null);
      setIsEditing(false);
      setError(null);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 422) {
          // Обработка ошибок валидации от сервера
          const serverErrors = error.response.data?.detail || [];
          const errorMessages = serverErrors
            .map((err: any) => {
              const field = err.loc?.[1] || "поле";
              return `${field}: ${err.msg}`;
            })
            .join("\n");

          setError(`Ошибки валидации:\n${errorMessages}`);
        } else {
          setError(
            `Ошибка сервера: ${error.response?.data?.detail || error.message}`
          );
        }
      } else {
        setError("Неизвестная ошибка при обновлении профиля");
      }
      console.error("Ошибка при обновлении профиля:", error);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    if (!validateInput(value, name)) return;

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

    if (role) setUserRole(role);
    if (jwt) getUserProfile();
  }, []);

  if (!userData) {
    return <div>Загрузка...</div>;
  }

  return (
    <div className={styles["modal_main"]} onClick={handleClickOutside}>
      <div className={styles["modal_secondary"]}>
        <div className={styles.profile}>
          {error && <div className={styles.error}>{error}</div>}

          {/* Блок с аватаром и рейтингом */}
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
                      <img src={previewImage} alt="Предпросмотр аватара" />
                    ) : userData?.avatar ? (
                      <img
                        src={`http://127.0.0.1:8000/${userData.avatar}`}
                        alt="Текущий аватар"
                      />
                    ) : (
                      <div className={styles.upload_placeholder}>
                        <span>+</span>
                        <span>Добавить фото</span>
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
                    />
                  ) : (
                    <div className={styles.default_avatar}>👤</div>
                  )}
                </div>
              )}
            </div>

            {(userRole === "mentor" || userRole === "investor") && (
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
            )}
          </div>

          {/* Основная информация */}
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

          {/* Общие поля */}
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
              <p>{userData.description}</p>
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
                {specializations.map((spec, index) => (
                  <option key={index} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
            ) : (
              <p>{userData.specialization}</p>
            )}
          </div>

          {/* Поля для наставника */}
          {userRole === "mentor" && (
            <>
              <div className={styles.profile_info}>
                <label>Опыт работы (в мес.):</label>
                {isEditing ? (
                  <input
                    type="number"
                    name="experience"
                    value={userEditData.experience || ""}
                    onChange={handleInputChange}
                    min="0"
                    onKeyDown={(e) => {
                      if (e.key === "-" || e.key === "e") e.preventDefault();
                    }}
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
                    value={userEditData.skills || ""}
                    onChange={handleInputChange}
                    maxLength={50}
                    required
                  />
                ) : (
                  <p>{userData.skills}</p>
                )}
              </div>
            </>
          )}

          {/* Поля для инвестора */}
          {userRole === "investor" && (
            <>
              <div className={styles.profile_info}>
                <label>Бюджет (в руб.):</label>
                {isEditing ? (
                  <input
                    type="number"
                    name="budget"
                    value={userEditData.budget || ""}
                    onChange={handleInputChange}
                    min="0"
                    onKeyDown={(e) => {
                      if (e.key === "-" || e.key === "e") e.preventDefault();
                    }}
                    required
                  />
                ) : (
                  <p>{Number(userData.budget).toLocaleString("ru-RU")} ₽</p>
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

          {/* Блок с отзывами */}
          {(userRole === "mentor" || userRole === "investor") && (
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
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Кнопки управления */}
          <div className={styles.buttonsContainer}>
            {isEditing ? (
              <div className={styles.buttons_block}>
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
              </div>
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
    </div>
  );
}
