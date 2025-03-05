import Button from "../Button/Button";
import styles from "./Product.module.css";
import { Link } from "react-router-dom";

export interface ProductProps {
  id: number;
  title: string;
  tagline: string;
  investment: string;
  role?: string;
  category: string;
  budget?: string;
  experience?: string;
  description?: string;
  skills?: string;
}

export function Product({
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
            <b>Бюджет:</b>
          ) : (
            <b>Специальность: </b>
          )}
          {role === "mentor" ? (
            <p>{skills}</p>
          ) : role === "investor" ? (
            <p>{budget}</p>
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
