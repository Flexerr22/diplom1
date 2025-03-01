// import { ArrowRight, CircleUserRound } from 'lucide-react';
import Button from "../Button/Button";
import styles from "./Header.module.css";
import { Container } from "../Container/Container";
import { useEffect, useState } from "react";
import { Modal } from "../Modal/Modal";
import { Messages } from "../Messages/Messages";
import { Profile } from "../Profile/Profile";
import Cookies from "js-cookie";

export type ModalType = "login" | "messages" | "profile" | null;

function Header() {
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  useEffect(() => {
    const jwt = Cookies.get("jwt");

    if (jwt) {
      setIsAuth(true);
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
              <li>
                <a href="/businessman">Предпринимателям</a>
              </li>
              <div className={styles["border"]}></div>
              <li>
                <a href="/mentor">Наставникам</a>
              </li>
              <div className={styles["border"]}></div>
              <li>
                <a href="/investor">Инвесторам</a>
              </li>
            </ul>
          </nav>

          <div className={styles["block-icons"]}>
            <nav className={styles["nav-icons"]}>
              {isAuth && <img src="/plus.svg" alt="Чаты" />}
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
