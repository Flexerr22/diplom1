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
}

export function Product({
  id,
  title,
  tagline,
  investment,
  category,
}: ProductProps) {
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
          <Link to={`/project/${id}`}>
            <Button className={styles["button_product"]}>Подробнее</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
