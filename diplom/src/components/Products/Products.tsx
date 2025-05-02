import axios from "axios";
import { Product } from "../Product/Product";
import Search from "../Search/Search";
import styles from "./Products.module.css";
import { useEffect, useState } from "react";
import { ProductProps } from "../../helpers/projects.props";

interface ProductsProps {
  selectedCategories: string[];
  selectedStages: string[];
  selectedInvest: string[];
  selectedExperience: string[];
}

const experienceMapping: { [key: string]: { min: number; max: number } } = {
  "от 1-3 лет": { min: 1, max: 3 },
  "от 3-6 лет": { min: 3, max: 6 },
  "от 6 до 9 лет": { min: 6, max: 9 },
  "более 10 лет": { min: 10, max: Infinity },
};

// Маппинг для инвестиций
const investmentMapping: { [key: string]: { min: number; max: number } } = {
  "от 100 000 до 500 000": { min: 100000, max: 500000 },
  "от 500 000 до 1 000 000": { min: 500000, max: 1000000 },
  "от 1 000 000 до 2 000 000": { min: 1000000, max: 2000000 },
  "от 2 000 000 до 3 000 000": { min: 2000000, max: 3000000 },
  "от 3 000 000 и выше": { min: 3000000, max: Infinity },
};

export function Products({
  selectedCategories,
  selectedStages,
  selectedInvest,
  selectedExperience,
}: ProductsProps) {
  const [projects, setProjects] = useState<ProductProps[]>([]);
  const [search, setSearch] = useState<string>("");

  // Получение всех проектов
  const getAll = async () => {
    await axios
      .get<ProductProps[]>("http://127.0.0.1:8000/projects")
      .then((response) => setProjects(response.data));
  };

  // Фильтрация проектов по роли "entrepreneur"
  const filterProject = projects.filter((prev) => prev.role === "entrepreneur");

  const filteredProjects = filterProject.filter((project) => {
    // Проверка поискового запроса
    const matchesSearch = project.title
      .toLowerCase()
      .includes(search.toLowerCase());

    // Проверка выбранных категорий
    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(project.category.toLowerCase());

    const matchesStage =
      selectedStages.length === 0 ||
      (project.stage !== undefined &&
        selectedStages.includes(project.stage.toLowerCase()));

    const matchesInvest =
      selectedInvest.length === 0 ||
      selectedInvest.some((inv) => {
        const range = investmentMapping[inv];
        const projectInv = parseInt(
          project.investment?.replace(/\D/g, "") || "0"
        );
        return projectInv >= range.min && projectInv <= range.max;
      });

    const matchesExperience =
      selectedExperience.length === 0 ||
      selectedExperience.some((exp) => {
        const range = experienceMapping[exp];
        const projectExp = parseInt(
          project.mentorExperience?.match(/\d+/)?.[0] || "0"
        );
        return projectExp >= range.min && projectExp <= range.max;
      });
    return (
      matchesSearch &&
      matchesCategory &&
      matchesStage &&
      matchesInvest &&
      matchesExperience
    );
  });

  useEffect(() => {
    getAll();
  }, []); // Пустой массив зависимостей, чтобы useEffect сработал только один раз

  // Обработчик изменения поискового запроса
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return (
    <div className={styles["main"]}>
      <Search isValid={false} onChange={handleSearch} />
      {filteredProjects.length > 0 ? (
        <div className={styles["products"]}>
          {filteredProjects.map((item, index) => (
            <Product
              key={index}
              id={item.id}
              title={item.title}
              tagline={item.tagline}
              investment={item.investment}
              category={item.category}
              user_id={item.user_id}
            />
          ))}
        </div>
      ) : (
        <div className={styles.error}>По вашему запросy ничего не найдено</div>
      )}
    </div>
  );
}
