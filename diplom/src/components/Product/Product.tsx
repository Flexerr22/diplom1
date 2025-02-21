import { Star } from "lucide-react";
import Button from "../Button/Button";
import styles from "./Product.module.css";

export interface ProductProps {
  details: string;
  title: string;
  value: number;
  unit: string;
  rating: number;
  valueDescription: string;
}

export function Product({
  details,
  title,
  valueDescription,
  value,
  unit,
  rating,
}: ProductProps) {
  return (
    <div>
      <div className={styles["product"]}>
        <b className={styles["title"]}>"{title}" </b>
        <textarea className={styles["description"]}>{details}</textarea>
        <b className={styles["valueDescription"]}>{valueDescription}: </b>
        <div className={styles["price"]}>
          <b>{value}</b>
          <b>{unit}</b>
        </div>
        <div className={styles["product-bottom"]}>
          <div className={styles["reit"]}>
            <p>Рейтинг: </p>
            <p>{rating}</p>
            <Star size={17} color="#FFCC00" />
          </div>
          <Button className={styles["button_product"]}>Подробнее</Button>
        </div>
      </div>
    </div>
  );
}
