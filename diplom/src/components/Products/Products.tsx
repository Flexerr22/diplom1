import axios from "axios";
import { Product, ProductProps } from "../Product/Product";
import Search from "../Search/Search";
import styles from "./Products.module.css";
import { useEffect, useState } from "react";

export function Products() {
  const [projects, setProjects] = useState<ProductProps[]>([]);
  const getAll = async () => {
    await axios
      .get<ProductProps[]>("http://127.0.0.1:8000/projects")
      .then((responce) => setProjects(responce.data));
  };

  const filterProject = projects.filter((prev) => prev.role === "entrepreneur");

  useEffect(() => {
    getAll();
  });
  return (
    <div className={styles["main"]}>
      <Search isValid={false} />
      <div className={styles["products"]}>
        {filterProject.map((item, index) => (
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
