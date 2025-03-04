import { Star } from "lucide-react";
import Button from "../Button/Button";
import styles from "./Product.module.css";
import { Link } from "react-router-dom";

export interface ProductProps {
  id: number;
  title: string;
  tagline: string;
  category: string;
  investment: string;
  stage: string;
}

export function Product({
  id,
  title,
  tagline,
  category,
  investment,
  stage,
}: ProductProps) {
  return (
    <div>
      <div className={styles["product"]}>
        <b className={styles["title"]}>"{title}" </b>
        <textarea className={styles["description"]}>{tagline}</textarea>
        <p className={styles["valueDescription"]}>
          Специальность: {category}:{" "}
        </p>
        <div>
          <b>Требуемые инвестиции</b>
          <p>{investment}</p>
        </div>
        <div>
          <b>Стадия проекта</b>
          <p>{stage}</p>
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
