import { useEffect, useState } from "react";
import Button from "../Button/Button";
import { Container } from "../Container/Container";
import styles from "./Info.module.css";
import { Modal } from "../Modal/Modal";
import Cookies from "js-cookie";

export function Info() {
  const [modalOpen, setModalOpen] = useState(false);
  const [isAuthtozise, setIsAuthtorize] = useState(false);

  useEffect(() => {
    const jwt = Cookies.get("jwt");
    setIsAuthtorize(!!jwt); // Обновляем при каждом изменении jwt
  }, []);
  return (
    <Container>
      <div className={styles["main"]}>
        <div className={styles["info"]}>
          <img src="/logo.svg" width={50} height={50} />
          <p>
            <span className={styles["span1"]}>Mentor Connect</span> - площадка,
            предназначенная для воплощения{" "}
            <span className={styles["span2"]}>ваших идей</span> ! Станьте частью
            нашего проекта прямо сейчас !
          </p>
        </div>

        {!isAuthtozise && (
          <Button
            appearence="big"
            className={styles["button_register_info"]}
            onClick={() => setModalOpen(true)}
          >
            Зарегистрироваться
          </Button>
        )}
        {modalOpen && (
          <div className={styles["modal_main"]}>
            <div className={styles["modal_secondary"]}>
              <button
                      onClick={() => setModalOpen(false)}
                      className={styles["close"]}
                    >
                      ✖
                    </button>
              <Modal 
                closeModal={() => setModalOpen(false)} 
                setIsAuth={(value) => {
                  setIsAuthtorize(value);
                  setModalOpen(false);
                }} 
              />
            </div>
          </div>
        )}
      </div>
    </Container>
  );
}
