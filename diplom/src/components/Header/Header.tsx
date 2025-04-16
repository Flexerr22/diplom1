import Button from "../Button/Button";
import styles from "./Header.module.css";
import { Container } from "../Container/Container";
import { useEffect, useState } from "react";
import { Modal } from "../Modal/Modal";
import { Messages } from "../Messages/Messages";
import Cookies from "js-cookie";
import { Profile } from "../Profile/Profile";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { MessageProps } from "../../helpers/message.props";
import { ProfileInfo } from "../../helpers/user.props";

export type ModalType = "login" | "messages" | "profile" | null;

function Header() {
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [user_id, setUserId] = useState<string | null>(null);
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [message, setMessage] = useState<MessageProps[]>([]);

  useEffect(() => {
    const jwt = Cookies.get("jwt");
    const role = Cookies.get("role");

    if (jwt) {
      setIsAuth(true);
      const decoded = jwtDecode<{ sub: string }>(jwt);
      setUserId(decoded.sub);

      // Получаем данные пользователя, включая аватар
      const getUserProfile = async () => {
        try {
          const response = await axios.get<ProfileInfo>(
            `http://127.0.0.1:8000/users/${decoded.sub}`
          );
          setUserAvatar(response.data.avatar); // Устанавливаем URL аватара
        } catch (error) {
          console.error("Ошибка при получении данных профиля:", error);
        }
      };

      getUserProfile();
    }
    if (role) {
      setUserRole(role);
    }
    getMessage();
  }, []);

  const getMessage = async () => {
    const jwt = Cookies.get("jwt");
    if (!jwt) return;

    try {
      const decoded = jwtDecode<{ sub: string }>(jwt);
      const user_id = parseInt(decoded.sub, 10);

      const responce = await axios.get<MessageProps[]>(
        `http://127.0.0.1:8000/notifications/${user_id}`
      );
      setMessage(responce.data);
    } catch (error) {
      console.error("Произошла ошибка", error);
    }
  };

  const handleClickOutside = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setActiveModal(null);
    }
  };

  return (
    <div className={styles["color"]}>
      <Container>
        <header className={styles["header"]}>
          <div className={styles["logo"]}>
            <a href="/">
              Mentor<span>Connect</span>
            </a>
            <img src="/logo.svg" alt="Логотип" />
          </div>

          <nav className={styles["nav-text"]}>
            <ul className={styles["ul"]}>
              {userRole === "entrepreneur" && (
                <>
                  <li>
                    <a href="/mentor">Наставникам</a>
                  </li>
                  <div className={styles["border"]}></div>
                  <li>
                    <a href="/investor">Инвесторам</a>
                  </li>
                  <div className={styles["border"]}></div>
                </>
              )}

              {(userRole === "mentor" || userRole === "investor") && (
                <>
                  <li>
                    <a href="/projects">Проекты</a>
                  </li>
                </>
              )}
              <li>
                <a href={`/my-projects/${user_id}`}>Мои проекты</a>
              </li>
              <div className={styles["border"]}></div>
              <li>
                <a href={"/our_projects"}>Общие проекты</a>
              </li>
            </ul>
          </nav>

          <div className={styles["block-icons"]}>
            <nav className={styles["nav-icons"]}>
              {isAuth && (
                <a href="/add">
                  <img src="/plus.svg" alt="Чаты" />
                </a>
              )}
              <a href="/chats">
                <img src="/chat.svg" alt="Чаты" />
              </a>
              <div className={styles.message}>
                {message.length > 0 && (
                  <div className={styles.count}>{message.length}</div>
                )}

                <img
                  src="/messages.svg"
                  alt="Уведомления"
                  onClick={() =>
                    setActiveModal((prev) =>
                      prev === "messages" ? null : "messages"
                    )
                  }
                />
              </div>

              {activeModal === "messages" && (
                <Messages
                  setActiveModal={setActiveModal}
                  getNotifications={getMessage}
                />
              )}
              <a href="/favourites">
                <img src="/like.svg" alt="Избранное" />
              </a>
            </nav>
            {!isAuth ? (
              <Button
                onClick={() => setActiveModal("login")}
                appearence="small"
                className={styles["button_header"]}
              >
                Войти
              </Button>
            ) : (
              <img
                width={35}
                height={35}
                src={
                  userAvatar
                    ? `http://127.0.0.1:8000/${userAvatar}`
                    : "/team.avif"
                }
                alt="Иконка профиля"
                className={styles.icon_profile}
                onClick={() =>
                  setActiveModal((prev) =>
                    prev === "profile" ? null : "profile"
                  )
                }
              />
            )}
            {activeModal === "profile" && (
              <Profile
                setIsAuth={setIsAuth}
                closeModal={() => setActiveModal(null)}
                setActiveModal={setActiveModal}
              />
            )}
          </div>
        </header>
        {activeModal === "login" && (
          <div className={styles["modal_main"]} onClick={handleClickOutside}>
            <div className={styles["modal_secondary"]}>
              <button
                onClick={() => setActiveModal(null)}
                className={styles["close"]}
              >
                ✖
              </button>
              <Modal
                closeModal={() => setActiveModal(null)}
                setIsAuth={setIsAuth}
              />
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}

export default Header;
