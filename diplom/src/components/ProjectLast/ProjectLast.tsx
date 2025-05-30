import { ProductProps } from "../../types/projects.props";
import Button from "../Button/Button";
import styles from "./ProjectLast.module.css";
import { Link } from "react-router-dom";

export function ProjectLast({
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
          <Link to={`/project/${id}`}>
            <Button className={styles["button_product"]}>Подробнее</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
