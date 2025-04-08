import axios from "axios";
import Button from "../Button/Button";
import styles from "./Product.module.css";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from "react"; // Добавлен useEffect
import { CircleCheckBig } from "lucide-react";
import { ProductProps } from "../../helpers/projects.props";

export function Product({
  id,
  title,
  tagline,
  investment,
  category,
}: ProductProps) {
  const [isAdd, setIsAdd] = useState(false);

  // Проверяем, добавлен ли проект в избранное, при загрузке компонента
  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    if (favorites.includes(id)) {
      setIsAdd(true);
    }
  }, [id]);

  const addFavourites = async () => {
    const jwt = Cookies.get("jwt");
    if (!jwt) {
      console.error("JWT-токен отсутствует");
      return;
    }

    const decoded = jwtDecode<{ sub: string }>(jwt);
    const user_id = parseInt(decoded.sub, 10);
    const project_id = id;

    try {
      await axios.post(
        `http://127.0.0.1:8000/users/favorites/add-to-favorites/${user_id}/${project_id}`
      );
      setIsAdd(true);

      const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
      if (!favorites.includes(id)) {
        favorites.push(id);
        localStorage.setItem("favorites", JSON.stringify(favorites));
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Ошибка сервера:", error.response?.data); // Вывод данных ошибки
      } else {
        console.error("Неизвестная ошибка:", error);
      }
    }
  };

  return (
    <div>
      <div className={styles["product"]}>
        <b className={styles["title"]}>"{title}" </b>
        <textarea className={styles["description"]} disabled>
          {tagline}
        </textarea>
        <div className={styles["price"]}>
          <b>Требуемые вложения:</b>
          <p>{investment}</p>
        </div>
        <div className={styles["reit"]}>
          <b>Специальность: </b>
          <p>{category}</p>
        </div>
        <div className={styles["product-bottom"]}>
          {isAdd ? (
            <CircleCheckBig />
          ) : (
            <Button
              className={styles["button_product"]}
              onClick={addFavourites}
            >
              Добавить в избранное
            </Button>
          )}
          <Link to={`/project/${id}`}>
            <Button className={styles["button_product"]}>Подробнее</Button>
          </Link>
          <Button className={styles["button_product"]}>Сотрудничать</Button>
        </div>
      </div>
    </div>
  );
}
