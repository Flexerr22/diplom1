import styles from "./Login.module.css";
import { ChangeEvent, FormEvent, useState } from "react";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";

export interface LoginProps {
  token: string;
  role: string;
}

export type Login = {
  email: {
    value: string;
  };
  password: {
    value: string;
  };
};

interface LoginComponentProps {
  closeModal: () => void;
  setIsAuth: (value: boolean) => void;
}

export function Login({ closeModal, setIsAuth }: LoginComponentProps) {
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [error, setError] = useState<string | null>();

  const sendLogin = async (email: string, password: string) => {
    try {
      const { data } = await axios.post<LoginProps>(
        "http://127.0.0.1:8000/users/login",
        {
          email,
          password,
        }
      );
      Cookies.set("jwt", data.token, {
        expires: 7,
        secure: true,
        sameSite: "Strict",
      });
      Cookies.set("role", data.role, {
        expires: 7,
        secure: true,
        sameSite: "Strict",
      });
      setIsAuth(true);
      closeModal();
    } catch (e) {
      if (e instanceof AxiosError) {
        if (e.response?.status === 401) {
          setError("Неправильный пароль или email");
          setEmailError(true);
          setPasswordError(true);
        }
      }
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "email") {
      setEmailError(false);
      if (!value) setError("Пожалуйста, заполните email");
    } else if (name === "password") {
      setPasswordError(false);
      if (!value) setError("Пожалуйста, заполните пароль");
    }
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setEmailError(false);
    setPasswordError(false);
    const target = e.target as typeof e.target & Login;
    const { email, password } = target;
    if (email.value === "" && password.value === "") {
      setError("Пожалуйста заполните все поля");
      if (!email.value) setEmailError(true);
      if (!password.value) setPasswordError(true);
    }
    if (!/\S+@\S+\.\S+/.test(email.value)) {
      setError("Некорректный формат email.");
      setEmailError(true);
      return;
    }
    sendLogin(email.value, password.value);
  };

  return (
    <div className={styles["login"]}>
      <p className={styles["title"]}>Войти в аккаунт</p>
      <button className={styles.google}>
        <img src="/google.svg" width={20} height={20} alt="Иконка google" />
        Войти с помощью Google
      </button>
      <div className={styles.border_or}>
        <div className={styles.border}></div>
        <p className={styles.or}>OR</p>
        <div className={styles.border}></div>
      </div>
      {error && <div className={styles["error"]}>{error}</div>}
      <form className={styles["form_login"]} onSubmit={submit}>
        <div className={styles["input"]}>
          <label className={styles["label"]}>Email</label>
          <input
            type="email"
            placeholder="Email"
            name="email"
            onChange={handleInputChange}
            className={`${styles["input"]} ${
              emailError ? styles["error"] : ""
            }`}
          />
        </div>
        <div className={styles["input"]}>
          <label className={styles["label"]}>Password</label>
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={handleInputChange}
            className={`${styles["input"]} ${
              passwordError ? styles["error"] : ""
            }`}
          />
        </div>
        <button type="submit" className={styles["login_button"]}>
          Войти
        </button>
      </form>
    </div>
  );
}
