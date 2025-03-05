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
      const responce = await axios.post<RegisterProps>(
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
      Cookies.set("role", responce.data.role, {
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
        }
      }
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

    sendRegister(name.value, email.value, password_hash.value, role.value);
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "email") {
      setEmailError(false); // Убираем ошибку email
      if (!value) setError("Пожалуйста, заполните email");
    } else if (name === "password_hash") {
      setPasswordError(false); // Убираем ошибку password
      if (!value) setError("Пожалуйста, заполните пароль");
    } else if (name === "name") {
      setNameError(false); // Убираем ошибку password
      if (!value) setError("Пожалуйста, заполните имя");
    }
    setData({ ...data, [name]: value });
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
            type="text"
            placeholder="Username"
          />
        </div>
        <div className={styles["input"]}>
          <label className={styles["label"]}>Email</label>
          <input
            value={data.email}
            name="email"
            onChange={handleInputChange}
            type="email"
            placeholder="Email"
          />
        </div>
        <div className={styles["input"]}>
          <label className={styles["label"]}>Password</label>
          <input
            type="password"
            value={data.password_hash}
            onChange={handleInputChange}
            placeholder="Password"
            name="password_hash"
          />
        </div>
        <button type="submit" className={styles["login_button"]}>
          Регистрация
        </button>
      </form>
    </div>
  );
}
