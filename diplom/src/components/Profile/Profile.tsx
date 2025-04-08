import axios, { AxiosError } from "axios";
import styles from "./Profile.module.css";
import Cookies from "js-cookie";
import { ModalType } from "../Header/Header";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { ProfileInfo } from "../../helpers/user.props";

interface LoginComponentProps {
  setIsAuth: (value: boolean) => void;
  closeModal: () => void;
  setActiveModal: (value: ModalType) => void;
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

  const deleteProfile = async () => {
    try {
      await axios.post("http://127.0.0.1:8001/users/logout");
      Cookies.remove("jwt");
      Cookies.remove("role");
      setIsAuth(false);
      closeModal();
    } catch (e) {
      if (e instanceof AxiosError) {
        console.log("Ошибка");
      }
    }
  };

  const validateInput = (value: string): boolean => {
    const regex = /^[a-zA-Zа-яА-Я0-9\s.,!?()@_-]*$/;
    return regex.test(value);
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
    const isFormValid = fieldsToCheck.every((field) => userEditData[field]);

    if (!isFormValid) {
      alert("Пожалуйста, заполните все поля");
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
                    type="text"
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
                  <ul>
                    <li>{userData.skills}</li>
                  </ul>
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
                    type="text"
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
