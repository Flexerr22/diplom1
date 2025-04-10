import styles from "./Login.module.css";
import { ChangeEvent, FormEvent, useState } from "react";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

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
  const [, setPasswordError] = useState(false);
  const [error, setError] = useState<string | null>();
  const navigate = useNavigate();

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
      navigate("/");
    } catch (e) {
      if (e instanceof AxiosError) {
        if (e.response?.status === 401) {
          setError("Неправильный email или пароль");
          setEmailError(true);
          setPasswordError(true);
        } else {
          setError("Произошла ошибка при входе");
        }
      }
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const trimmedValue = value.replace(/\s+/g, ""); // Убираем все пробелы

    // Обновляем значение в поле ввода
    e.target.value = trimmedValue;

    if (name === "email") {
      setEmailError(false);
      if (!trimmedValue) setError("Пожалуйста, заполните email");
    } else if (name === "password") {
      setPasswordError(false);
      if (!trimmedValue) setError("Пожалуйста, заполните пароль");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === " ") {
      e.preventDefault(); // Предотвращаем ввод пробела
    }
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setEmailError(false);
    setPasswordError(false);

    const target = e.target as typeof e.target & Login;
    const { email, password } = target;

    if (!email.value || !password.value) {
      setError("Пожалуйста, заполните все поля");
      if (!email.value) setEmailError(true);
      if (!password.value) setPasswordError(true);
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email.value)) {
      setError("Некорректный формат email.");
      setEmailError(true);
      return;
    }

    // Проверка минимальной длины пароля
    if (password.value.length < 6) {
      setError("Пароль должен содержать минимум 6 символов");
      setPasswordError(true);
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
            onKeyDown={handleKeyDown}
            className={`${styles["input"]} ${
              emailError ? styles["error"] : ""
            }`}
          />
        </div>
        <div className={styles["input"]}>
          <label className={styles["label"]}>Password</label>
          <input
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Password"
            name="password"
            minLength={6}
            maxLength={15}
            type="password"
          />
        </div>
        <button type="submit" className={styles["login_button"]}>
          Войти
        </button>
      </form>
    </div>
  );
}
