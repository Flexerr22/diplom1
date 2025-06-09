import { useState } from "react";
import styles from "./Modal.module.css";
import { Login } from "../Login/Login";
import { Register } from "../Register/Register";

interface ModalProps {
  closeModal: () => void;
  setIsAuth: (value: boolean) => void;
  onLoginSuccess?: () => void;
}

export function Modal({ 
  closeModal, 
  setIsAuth, 
  onLoginSuccess 
}: ModalProps) {
  const [isButtonAuth, setIsButtonAuth] = useState(false);

  return (
    <div className={styles["authtorize"]}>
      <div className={styles["buttons"]}>
        <button
          className={isButtonAuth ? styles.auth : styles.register}
          onClick={() => setIsButtonAuth(true)}
        >
          Авторизация
        </button>
        <button
          className={isButtonAuth ? styles.register : styles.auth}
          onClick={() => setIsButtonAuth(false)}
        >
          Регистрация
        </button>
      </div>
      {isButtonAuth ? (
        <Login 
          closeModal={closeModal} 
          setIsAuth={setIsAuth} 
          onLoginSuccess={onLoginSuccess || (() => {})} // Добавляем fallback
        />
      ) : (
        <Register 
          setIsAuth={setIsAuth} 
          setIsButtonAuth={setIsButtonAuth} 
        />
      )}
    </div>
  );
}