import axios, { AxiosError } from "axios";
import styles from "./Profile.module.css";
import Cookies from "js-cookie";
import { ModalType } from "../Header/Header";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

interface ProfileInfo {
  email: string;
  name: string;
  avatar: string;
  description: string;
  contact?: string;
  specialization?: string;
  experience?: string;
  pastProjects?: string[];
  skills?: string[];
  budget?: string;
  investmentFocus?: string;
  portfolio?: string[];
}

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
  const [userEditData, setUserEditData] = useState<ProfileInfo>({
    email: "",
    name: "",
    avatar: "",
    description: "",
    contact: "",
    specialization: "",
    experience: "",
    pastProjects: [],
    skills: [],
    budget: "",
    investmentFocus: "",
    portfolio: [],
  });

  const deleteProfile = async () => {
    try {
      await axios.post("http://127.0.0.1:8000/users/logout");
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
      const userId = decoded.sub;

      const response = await axios.get<ProfileInfo>(
        `http://127.0.0.1:8000/users/${userId}`
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

    try {
      const decoded = jwtDecode<{ sub: string }>(jwt);
      const userId = decoded.sub;

      // Логируем данные перед отправкой
      console.log("Отправляемые данные на сервер:", userEditData);

      const response = await axios.patch<ProfileInfo>(
        `http://127.0.0.1:8000/users/update-user/${userId}`,
        userEditData
      );

      setUserData(response.data);
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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // Если поле пустое, ставим null
    setUserEditData((prev) => ({
      ...prev,
      [name]: value === "" ? null : value,
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
          <div className={styles.profile_info}>
            <label>Аватар:</label>
            {isEditing ? (
              <input type="file" accept="image/*" />
            ) : (
              <img
                width={100}
                height={100}
                src={userData.avatar || "/team.avif"}
                alt="Иконка профиля"
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
              />
            ) : (
              <p>{userData.description}</p>
            )}
          </div>
          <div className={styles.profile_info}>
            <label>Специализация:</label>
            {isEditing ? (
              <input
                type="text"
                name="specialization"
                value={userEditData.specialization || ""}
                onChange={handleInputChange}
              />
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
                  />
                ) : (
                  <p>{userData.experience}</p>
                )}
              </div>
              <div className={styles.profile_info}>
                <label>Прошлые проекты:</label>
                {isEditing ? (
                  <textarea
                    name="pastProjects"
                    value={userEditData.pastProjects?.join(", ") || ""}
                    onChange={(e) =>
                      setUserEditData((prevData) => ({
                        ...prevData,
                        pastProjects: e.target.value.split(", "),
                      }))
                    }
                  />
                ) : (
                  <ul>
                    {userData.pastProjects?.map((project, index) => (
                      <li key={index}>{project}</li>
                    ))}
                  </ul>
                )}
              </div>
              <div className={styles.profile_info}>
                <label>Навыки:</label>
                {isEditing ? (
                  <textarea
                    name="skills"
                    value={userEditData.skills?.join(", ") || ""}
                    onChange={(e) =>
                      setUserEditData((prevData) => ({
                        ...prevData,
                        skills: e.target.value.split(", "),
                      }))
                    }
                  />
                ) : (
                  <ul>
                    {userData.skills?.map((skill, index) => (
                      <li key={index}>{skill}</li>
                    ))}
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
                  />
                ) : (
                  <p>{userData.budget}</p>
                )}
              </div>
              <div className={styles.profile_info}>
                <label>Направление инвестиций:</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="investmentFocus"
                    value={userEditData.investmentFocus || ""}
                    onChange={handleInputChange}
                  />
                ) : (
                  <p>{userData.investmentFocus}</p>
                )}
              </div>
              <div className={styles.profile_info}>
                <label>Портфолио:</label>
                {isEditing ? (
                  <textarea
                    name="portfolio"
                    value={userEditData.portfolio?.join(", ") || ""}
                    onChange={(e) =>
                      setUserEditData((prevData) => ({
                        ...prevData,
                        portfolio: e.target.value.split(", "),
                      }))
                    }
                  />
                ) : (
                  <ul>
                    {userData.portfolio?.map((project, index) => (
                      <li key={index}>{project}</li>
                    ))}
                  </ul>
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
