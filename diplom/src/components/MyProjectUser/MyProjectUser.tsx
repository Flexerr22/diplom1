import Button from "../Button/Button";
import styles from "./MyProjectUser.module.css";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import Cookies from "js-cookie";
import { RolesGroupProps } from "../../helpers/projects.props";

export function MyProjectUser({
  id,
  name,
  description,
  specialization,
  budget,
  experience,
  role,
}: RolesGroupProps) {
  const deleteFavourites = async (id: number) => {
    const jwt = Cookies.get("jwt");
    if (!jwt) {
      console.error("JWT-токен отсутствует");
      return;
    }

    const decoded = jwtDecode<{ sub: string }>(jwt);
    const user_id = parseInt(decoded.sub, 10);
    const favorite_id = id;

    try {
      await axios.delete(
        `http://127.0.0.1:8000/mentors-investors/favorites/delete-from-favorites/${user_id}/${favorite_id}?favorite_user_id=${favorite_id}`
      );
      localStorage.removeItem("favorites_user");
      window.location.reload();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Ошибка сервера:", error.response?.data); // Вывод данных ошибки
        console.error("Статус ошибки:", error.response?.status); // Вывод статуса ошибки
        console.error("URL запроса:", error.config?.url); // Вывод URL запроса
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
          <Button
            className={styles["button_product"]}
            onClick={() => deleteFavourites(id)}
          >
            Удалить проект
          </Button>
          <Link to={`/user/${id}`}>
            <Button className={styles["button_product"]}>Подробнее</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
