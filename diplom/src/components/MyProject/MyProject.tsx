import { jwtDecode } from "jwt-decode";
import Button from "../Button/Button";
import styles from "./MyProject.module.css";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import { ProductProps } from "../../types/projects.props";

export function MyProject({
  id,
  title,
  tagline,
  investment,
  role,
  category,
  budget,
  experience,
  description,
  skills,
}: ProductProps) {
  const deleteFavourites = async (id: number) => {
    const jwt = Cookies.get("jwt");
    if (!jwt) {
      console.error("JWT-токен отсутствует");
      return;
    }

    const decoded = jwtDecode<{ sub: string }>(jwt);
    const user_id = parseInt(decoded.sub, 10);
    const project_id = id;

    try {
      await axios.delete(
        `http://127.0.0.1:8000/projects/delete-my-projcet/${user_id}/${project_id}`
      );
      localStorage.removeItem("favorites");
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
        <b className={styles["title"]}>"{title}" </b>
        {role === "mentor" || role === "investor" ? (
          <textarea className={styles["description"]} disabled>
            {description}
          </textarea>
        ) : (
          <textarea className={styles["description"]} disabled>
            {tagline}
          </textarea>
        )}
        <div className={styles["price"]}>
          {role === "mentor" ? (
            <b>Опыт работы:</b>
          ) : role === "investor" ? (
            <b>Бюджет:</b>
          ) : (
            <b>Требуемые вложения:</b>
          )}
          {role === "mentor" ? (
            <p>{experience}</p>
          ) : role === "investor" ? (
            <p>{budget}</p>
          ) : (
            <p>{investment}</p>
          )}
        </div>
        <div className={styles["reit"]}>
          {role === "mentor" ? (
            <b>Навыки:</b>
          ) : role === "investor" ? (
            ""
          ) : (
            <b>Специальность: </b>
          )}
          {role === "mentor" ? (
            <p>{skills}</p>
          ) : role === "investor" ? (
            ""
          ) : (
            <p>{category}</p>
          )}
        </div>
        <div className={styles["product-bottom"]}>
          <Button
            className={styles["button_product"]}
            onClick={() => deleteFavourites(id)}
          >
            Удалить проект
          </Button>
          <Link to={`/my-project/${id}`}>
            <Button className={styles["button_product"]}>Подробнее</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
