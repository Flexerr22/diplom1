import { FiltersCheckboxGroup } from "../FiltersCheckboxGroup/FiltersCheckboxGroup";
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
  "от 1 до 36 мес.",
  "от 36 до 72 мес.",
  "от 72 до 108 мес.",
  "более 108 мес.",
];

const investment = [
  "от 100 000 до 500 000",
  "от 500 000 до 1 000 000",
  "от 1 000 000 до 2 000 000",
  "от 2 000 000 до 3 000 000",
  "от 3 000 000 и выше",
];

interface FiltersProps {
  onCategoryChange: (categories: string[]) => void;
  onStageChange: (stages: string[]) => void;
  onInvestChange: (invesment: string[]) => void;
  onExperienceChange: (experience: string[]) => void;
}

export function Filters({
  onCategoryChange,
  onStageChange,
  onExperienceChange,
  onInvestChange,
}: FiltersProps) {
  const [userRole, setUserRole] = useState("");
  
  useEffect(() => {
    const role = Cookies.get("role");
    if (role) {
      setUserRole(role);
    }
  }, []);
  return (
    <div className={styles["main"]}>
      <div className={styles["checkbox"]}>
        <p className={styles["title"]}>Фильтрация</p>
        <div className={styles["checkbox_group"]}>
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
              onChange={onStageChange}
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
            onChange={onCategoryChange}
          />
          {userRole === "entrepreneur" && (
            <FiltersCheckboxGroup
              name="new"
              className={styles["filter"]}
              title="Бюджет инвестора"
              defaultItems={investment.map((invest) => ({
                text: invest,
                value: invest,
              }))}
              items={investment.map((invest) => ({
                text: invest,
                value: invest,
              }))}
              onChange={onInvestChange}
            />
          )}
          {userRole === "entrepreneur" && (
            <FiltersCheckboxGroup
              name="new"
              className={styles["filter"]}
              title="Опыт наставника"
              defaultItems={mentorExperience.map((exp) => ({
                text: exp,
                value: exp,
              }))}
              items={mentorExperience.map((exp) => ({
                text: exp,
                value: exp,
              }))}
              onChange={onExperienceChange}
            />
          )}
        </div>
      </div>
    </div>
  );
}
