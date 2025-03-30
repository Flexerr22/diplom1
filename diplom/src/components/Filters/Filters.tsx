import { FiltersCheckboxGroup } from "../FiltersCheckboxGroup/FiltersCheckboxGroup";
import { SortPopup } from "../SortPopup/sortpopup";
import styles from "./Filters.module.css";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

const categories = [
  "Программирование",
  "Дизайн",
  "Маркетинг",
  "Финансы",
  "Образование",
  "Медицина",
  "Искусство",
  "Строительство",
  "Наука",
  "Спорт",
];

const stages = [
  "Идея",
  "Прототип",
  "Разработка",
  "Тестирование",
  "Запуск",
  "Масштабирование",
  "Поддержка",
  "Завершен",
];

const mentorExperience = [
  "от 1-3 лет",
  "от 3-6 лет",
  "от 6 до 9 лет",
  "более 10 лет",
];

const investment = [
  "от 100 000 до 500 000",
  "от 500 000 до 1 000 000",
  "от 1 000 000 до 2 000 000",
  "от 2 000 000 до 3 000 000",
  "от 3 000 000 и выше",
];

export function Filters() {
  const [userRole, setUserRole] = useState("");
  useEffect(() => {
    const role = Cookies.get("role");
    if (role) {
      setUserRole(role);
    }
  }, []);
  return (
    <div className={styles["main"]}>
      <SortPopup />
      <div className={styles["checkbox"]}>
        <p className={styles["title"]}>Фильтрация</p>
        <div className={styles["checkbox_group"]}>
          {/* <FiltersCheckboxGroup
            name="new"
            className={styles["filter"]}
            title="Рейтинг"
            defaultItems={[
              { text: "5", value: "5" },
              { text: "4", value: "4" },
              { text: "3", value: "3" },
              { text: "2", value: "2" },
              { text: "1", value: "1" },
            ]}
            items={[
              { text: "5", value: "5" },
              { text: "4", value: "4" },
              { text: "3", value: "3" },
              { text: "2", value: "2" },
              { text: "1", value: "1" },
            ]}
          /> */}

          <FiltersCheckboxGroup
            name="new"
            className={styles["filter"]}
            title="Требуемые инвестиции"
            defaultItems={investment.map((invest) => ({
              text: invest,
              value: invest.toLowerCase(),
            }))}
            items={investment.map((invest) => ({
              text: invest,
              value: invest.toLowerCase(),
            }))}
          />
          <FiltersCheckboxGroup
            name="new"
            className={styles["filter"]}
            title="Опыт наставника"
            defaultItems={mentorExperience.map((exp) => ({
              text: exp,
              value: exp.toLowerCase(),
            }))}
            items={mentorExperience.map((exp) => ({
              text: exp,
              value: exp.toLowerCase(),
            }))}
          />
          {userRole !== "entrepreneur" && (
            <FiltersCheckboxGroup
              name="new"
              className={styles["filter"]}
              title="Стадия проекта"
              defaultItems={stages.map((stage) => ({
                text: stage,
                value: stage.toLowerCase(),
              }))}
              items={stages.map((stage) => ({
                text: stage,
                value: stage.toLowerCase(),
              }))}
            />
          )}

          <FiltersCheckboxGroup
            name="new"
            className={styles["filter"]}
            title="Специальность"
            defaultItems={categories.map((category) => ({
              text: category,
              value: category.toLowerCase(),
            }))}
            items={categories.map((category) => ({
              text: category,
              value: category.toLowerCase(),
            }))}
          />
        </div>
        <button className={styles["filters_button"]}>Подобрать</button>
      </div>
    </div>
  );
}
