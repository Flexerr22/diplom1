import axios, { AxiosError } from "axios";
import styles from "./Profile.module.css";
import Cookies from "js-cookie";
import { ModalType } from "../Header/Header";

interface LoginComponentProps {
  setIsAuth: (value: boolean) => void;
  closeModal: () => void;
  setActiveModal: (value: ModalType | null) => void;
}

export function Profile({
  setIsAuth,
  closeModal,
  setActiveModal,
}: LoginComponentProps) {
  const deleteProfile = async () => {
    try {
      await axios.post("http://127.0.0.1:8000/users/logout");
      Cookies.remove("jwt");
      setIsAuth(false);
      closeModal();
      setActiveModal(null);
    } catch (e) {
      if (e instanceof AxiosError) {
        console.log("Ошибка");
      }
    }
  };
  return (
    <div
      className={styles["modal_main"]}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setActiveModal(null);
        }
      }}
    >
      <div className={styles["modal_secondary"]}>
        <div className={styles.profile}>
          <img width={100} height={100} src="/team.avif" alt="Иконка профиля" />
          <div className={styles.profile_info}>
            <label>Ваш email:</label>
            <p>ilia2005951@gmail.com</p>
          </div>
          <div className={styles.profile_info}>
            <label>Ваше имя:</label>
            <p>Илья</p>
          </div>
          <button className={styles.profile_button} onClick={deleteProfile}>
            Выйти из аккаунта
          </button>
        </div>
      </div>
    </div>
  );
}
