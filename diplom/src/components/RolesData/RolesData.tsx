import Button from "../Button/Button";
import styles from "./RolesData.module.css";
import { Link } from "react-router-dom";

export interface RolesGroupProps {
  id: number;
  name: string;
  description: string;
  specialization: string;
  role?: string;
  budget?: string;
  experience?: string;
}

export function RolesData({
  id,
  name,
  description,
  specialization,
  budget,
  experience,
  role,
}: RolesGroupProps) {
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
          <Link to={`/user/${id}`}>
            <Button className={styles["button_product"]}>Подробнее</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
