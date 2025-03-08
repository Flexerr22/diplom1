import axios from "axios";
import { Product, ProductProps } from "../Product/Product";
import Search from "../Search/Search";
import styles from "./Products.module.css";
import { useEffect, useState } from "react";

export function Products() {
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

  const filteredProjects = filterProject.filter((project) =>
    project.title.toLowerCase().includes(search.toLowerCase())
  );

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
      <div className={styles["products"]}>
        {filteredProjects.map((item, index) => (
          <Product
            key={index}
            id={item.id}
            title={item.title}
            tagline={item.tagline}
            investment={item.investment}
            category={item.category}
          />
        ))}
      </div>
    </div>
  );
}
