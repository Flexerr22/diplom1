import Button from "../Button/Button";
import styles from "./Header.module.css";
import { Container } from "../Container/Container";
import { useEffect, useState } from "react";
import { Modal } from "../Modal/Modal";
import { Messages } from "../Messages/Messages";
import Cookies from "js-cookie";
import { Profile } from "../Profile/Profile";

export type ModalType = "login" | "messages" | "profile" | null;

function Header() {
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const jwt = Cookies.get("jwt");
    const role = Cookies.get("role");

    if (jwt) {
      setIsAuth(true);
    }
    if (role) {
      setUserRole(role);
    }
  }, []);

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
                    <a href="/roleProjects">Наставникам</a>
                  </li>
                  <div className={styles["border"]}></div>
                  <li>
                    <a href="/roleProjects">Инвесторам</a>
                  </li>
                  <div className={styles["border"]}></div>
                  <li>
                    <a href="/my-projects">Мои проекты</a>
                  </li>
                </>
              )}

              {(userRole === "mentor" || userRole === "investor") && (
                <>
                  <li>
                    <a href="/projects">Проекты</a>
                  </li>
                </>
              )}
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
              <img
                src="/messages.svg"
                alt="Уведомления"
                onClick={() =>
                  setActiveModal((prev) =>
                    prev === "messages" ? null : "messages"
                  )
                }
              />

              {activeModal === "messages" && (
                <Messages setActiveModal={setActiveModal} />
              )}

              <img src="/like.svg" alt="Избранное" />
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
                src="/team.avif"
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
