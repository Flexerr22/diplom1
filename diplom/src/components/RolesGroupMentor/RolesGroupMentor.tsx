import axios from "axios";
import Search from "../Search/Search";
import styles from "./RolesGroupMentor.module.css";
import { useEffect, useState } from "react";
import { RolesData } from "../RolesData/RolesData";
import { RolesGroupProps } from "../../types/projects.props";

interface ProductsProps {
  selectedCategories: string[];
  selectedStages: string[];
  selectedInvest: string[];
  selectedExperience: string[];
}

const experienceMapping: { [key: string]: { min: number; max: number } } = {
  "от 1 до 36 мес.": { min: 1, max: 36 },
  "от 36 до 72 мес.": { min: 36, max: 72 },
  "от 72 до 108 мес.": { min: 72, max: 108 },
  "более 108 мес.": { min: 108, max: Infinity },
};

export function RolesGroupMentor({
  selectedCategories,
  selectedExperience,
}: ProductsProps) {
  const [users, setUsers] = useState<RolesGroupProps[]>([]);
  const [search, setSearch] = useState("");

  const getAll = async () => {
    await axios
      .get<RolesGroupProps[]>("http://127.0.0.1:8000/users")
      .then((responce) => setUsers(responce.data));
  };
  const mentorData = users.filter((prev) => prev.role === "mentor");

  const mentorDataSearch = mentorData.filter((project) => {
    // Проверка поискового запроса
    const matchesSearch = project.name
      .toLowerCase()
      .includes(search.toLowerCase());

    // Проверка выбранных категорий
    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(project.specialization.toLowerCase());

    const matchesExperience =
      selectedExperience.length === 0 ||
      selectedExperience.some((exp) => {
        const range = experienceMapping[exp];
        const projectExp = parseInt(
          project.experience?.match(/\d+/)?.[0] || "0"
        );
        return projectExp >= range.min && projectExp <= range.max;
      });
    return matchesSearch && matchesCategory && matchesExperience;
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    getAll();
  });
  return (
    <div className={styles["main"]}>
      <Search isValid={false} onChange={handleSearch} />
      {mentorDataSearch.length > 0 ? (
        <div className={styles["products"]}>
          {mentorDataSearch.map((item, index) => (
            <RolesData
              key={index}
              id={item.id}
              name={item.name}
              description={item.description}
              experience={item.experience}
              specialization={item.specialization}
              role={item.role}
              budget={item.budget}
            />
          ))}
        </div>
      ) : (
        <div className={styles.error}>
          По вашему запросу наставники не найдены
        </div>
      )}
    </div>
  );
}
