import { CircleCheckBig } from "lucide-react";
import Button from "../Button/Button";
import styles from "./RolesData.module.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import Cookies from "js-cookie";
import { RolesGroupProps } from "../../helpers/projects.props";

export function RolesData({
  id,
  name,
  description,
  specialization,
  budget,
  experience,
  role,
}: RolesGroupProps) {
  const [isAdd, setIsAdd] = useState(false);

  useEffect(() => {
    const favorites = JSON.parse(
      localStorage.getItem("favorites_user") || "[]"
    );
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
    const favorite_id = id;

    try {
      await axios.post(
        `http://127.0.0.1:8000/mentors-investors/favorites/add-to-favorites/${user_id}/${favorite_id}?favorite_user_id=${favorite_id}`
      );
      setIsAdd(true);

      const favorites = JSON.parse(
        localStorage.getItem("favorites_user") || "[]"
      );
      if (!favorites.includes(id)) {
        favorites.push(id);
        localStorage.setItem("favorites_user", JSON.stringify(favorites));
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
        <b className={styles["title"]}>"{name}"</b>
        <textarea className={styles["description"]} disabled>
          {description}
        </textarea>
        <div className={styles["price"]}>
          {role === "mentor" ? (
            <b>Опыт работы:</b>
          ) : role === "investor" ? (
            <b>Бюджет:</b>
          ) : (
            ""
          )}
          {role === "mentor" ? (
            <p>{experience}</p>
          ) : role === "investor" ? (
            <p>{budget}</p>
          ) : (
            ""
          )}
        </div>
        <div className={styles["reit"]}>
          <b>Специальность: </b>
          <p>{specialization}</p>
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
          <Link to={`/user/${id}`}>
            <Button className={styles["button_product"]}>Подробнее</Button>
          </Link>
          <Button className={styles["button_product"]}>Сотрудничать</Button>
        </div>
      </div>
    </div>
  );
}
