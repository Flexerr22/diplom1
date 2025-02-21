import { FiltersCheckboxGroup } from "../FiltersCheckboxGroup/FiltersCheckboxGroup";
import { SortPopup } from "../SortPopup/sortpopup";
import styles from "./Filters.module.css";

export function Filters() {
  return (
    <div className={styles["main"]}>
      <SortPopup />
      <div className={styles["checkbox"]}>
        <p className={styles["title"]}>Фильтрация</p>
        <div className={styles["checkbox_group"]}>
          <FiltersCheckboxGroup
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
          />

          <FiltersCheckboxGroup
            name="new"
            className={styles["filter"]}
            title="Кого ищете"
            defaultItems={[
              { text: "Наставник", value: "Наставник" },
              { text: "Инвестор", value: "Инвестор" },
            ]}
            items={[
              { text: "Наставник", value: "Наставник" },
              { text: "Инвестор", value: "Инвестор" },
            ]}
          />

          <FiltersCheckboxGroup
            name="new"
            className={styles["filter"]}
            title="Специальность"
            defaultItems={[
              { text: "Программирование", value: "Программирование" },
              { text: "Дизайн", value: "Дизайн" },
              { text: "Инженерия", value: "Инженерия" },
              { text: "Медицина", value: "Медицина" },
              { text: "Строительство", value: "Строительство" },
            ]}
            items={[
              { text: "Программирование", value: "Программирование" },
              { text: "Дизайн", value: "Дизайн" },
              { text: "Инженерия", value: "Инженерия" },
              { text: "Медицина", value: "Медицина" },
              { text: "Строительство", value: "Строительство" },
              { text: "Наука", value: "Наука" },
              { text: "Кулинария", value: "Кулинария" },
              { text: "Инвестор", value: "Инвестор" },
              { text: "Наставник", value: "Наставник" },
              { text: "Инвестор", value: "Инвестор" },
            ]}
          />
        </div>
        <button className={styles["filters_button"]}>Подобрать</button>
      </div>
    </div>
  );
}
