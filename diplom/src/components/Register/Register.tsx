import styles from "./Register.module.css";
import { ChangeEvent, FormEvent, useState } from "react";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";

export type Register = {
  name: {
    value: string;
  };
  email: {
    value: string;
  };
  password_hash: {
    value: string;
  };
  role: {
    value: string;
  };
};

export interface RegisterProps {
  name: string;
  email: string;
  password_hash: string;
  role: string;
}

interface RegisterComponentProps {
  setIsAuth: (value: boolean) => void;
  setIsButtonAuth: (value: boolean) => void;
}

export function Register({
  setIsAuth,
  setIsButtonAuth,
}: RegisterComponentProps) {
  const [error, setError] = useState<string | null>();
  const [, setEmailError] = useState(false);
  const [, setPasswordError] = useState(false);
  const [, setNameError] = useState(false);
  const [data, setData] = useState<RegisterProps>({
    name: "",
    email: "",
    password_hash: "",
    role: "",
  });

  const sendRegister = async (
    name: string,
    email: string,
    password_hash: string,
    role: string
  ) => {
    try {
      const response = await axios.post<RegisterProps>(
        "http://127.0.0.1:8000/users/register",
        {
          name,
          email,
          password_hash,
          role,
        }
      );
      setIsAuth(false);
      setIsButtonAuth(true);
      Cookies.set("role", response.data.role, {
        expires: 7,
        secure: true,
        sameSite: "Strict",
      });
    } catch (e) {
      if (e instanceof AxiosError) {
        if (e.response?.status === 401) {
          setError("Неправильный пароль или email");
          setEmailError(true);
          setPasswordError(true);
        } else if (e.response?.status === 409) {
          setError("Почта уже зарегистрирована");
          setEmailError(true);
        } else {
          setError("Произошла ошибка при регистрации");
        }
      }
    }
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const trimmedValue = value.replace(/\s+/g, ""); // Убираем все пробелы

    // Обновляем значение в поле ввода
    e.target.value = trimmedValue;

    if (name === "email") {
      setEmailError(false);
      if (!trimmedValue) setError("Пожалуйста, заполните email");
    } else if (name === "password_hash") {
      setPasswordError(false);
      if (!trimmedValue) setError("Пожалуйста, заполните пароль");
    } else if (name === "name") {
      setNameError(false);
      if (!trimmedValue) setError("Пожалуйста, заполните имя");
    }

    // Обновляем состояние
    setData({ ...data, [name]: trimmedValue });
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
    setNameError(false);

    const target = e.target as typeof e.target & Register;
    const { name, email, password_hash, role } = target;

    if (!email.value || !password_hash.value || !name.value || !role.value) {
      setError("Пожалуйста, заполните все поля");
      if (!email.value) setEmailError(true);
      if (!password_hash.value) setPasswordError(true);
      if (!name.value) setNameError(true);
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email.value)) {
      setError("Некорректный формат email.");
      setEmailError(true);
      return;
    }

    // Проверка минимальной длины пароля
    if (password_hash.value.length < 6) {
      setError("Пароль должен содержать минимум 6 символов");
      setPasswordError(true);
      return;
    }

    sendRegister(name.value, email.value, password_hash.value, role.value);
  };

  return (
    <div className={styles["login"]}>
      <div className={styles["login_block"]}>
        <p className={styles["title"]}>Зарегистрировать аккаунт</p>
        <button className={styles.google}>
          <img src="/google.svg" width={20} height={20} alt="Иконка google" />
          Регистрация с помощью Google
        </button>
        <div className={styles.border_or}>
          <div className={styles.border}></div>
          <p className={styles.or}>OR</p>
          <div className={styles.border}></div>
        </div>
      </div>
      {error && <div className={styles["error"]}>{error}</div>}
      <form className={styles["form_login"]} onSubmit={submit}>
        <div className={styles["input"]}>
          <label className={styles["label"]}>Роль</label>
          <select name="role" value={data.role} onChange={handleInputChange}>
            <option value={"mentor"}>Наставник</option>
            <option value={"investor"}>Инвестор</option>
            <option value={"entrepreneur"}>Предприниматель</option>
          </select>
        </div>
        <div className={styles["input"]}>
          <label className={styles["label"]}>Username</label>
          <input
            value={data.name}
            name="name"
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            type="text"
            placeholder="Username"
            minLength={6}
            maxLength={15}
          />
        </div>
        <div className={styles["input"]}>
          <label className={styles["label"]}>Email</label>
          <input
            value={data.email}
            name="email"
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            type="email"
            placeholder="Email"
            maxLength={30}
          />
        </div>
        <div className={styles["input"]}>
          <label className={styles["label"]}>Password</label>
            <input
              value={data.password_hash}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Password"
              name="password_hash"
              minLength={6}
              maxLength={15}
              type="password"
            />
        </div>
        <button type="submit" className={styles["login_button"]}>
          Регистрация
        </button>
      </form>
    </div>
  );
}
