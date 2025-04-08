import axios from "axios";
import Search from "../Search/Search";
import styles from "./RolesGroupInvestor.module.css";
import { useEffect, useState } from "react";
import { RolesData } from "../RolesData/RolesData";
import { RolesGroupProps } from "../../helpers/projects.props";

interface ProductsProps {
  selectedCategories: string[];
  selectedStages: string[];
  selectedInvest: string[];
  selectedExperience: string[];
}

// Маппинг для инвестиций
const investmentMapping: { [key: string]: { min: number; max: number } } = {
  "от 100 000 до 500 000": { min: 100000, max: 500000 },
  "от 500 000 до 1 000 000": { min: 500000, max: 1000000 },
  "от 1 000 000 до 2 000 000": { min: 1000000, max: 2000000 },
  "от 2 000 000 до 3 000 000": { min: 2000000, max: 3000000 },
  "от 3 000 000 и выше": { min: 3000000, max: Infinity },
};

export function RolesGroupInvestor({
  selectedCategories,
  selectedInvest,
}: ProductsProps) {
  const [users, setUsers] = useState<RolesGroupProps[]>([]);
  const [search, setSearch] = useState("");

  const getAll = async () => {
    await axios
      .get<RolesGroupProps[]>("http://127.0.0.1:8000/users")
      .then((responce) => setUsers(responce.data));
  };
  const investorData = users.filter((prev) => prev.role === "investor");

  const investorDataSearch = investorData.filter((project) => {
    // Проверка поискового запроса
    const matchesSearch = project.name
      .toLowerCase()
      .includes(search.toLowerCase());

    // Проверка выбранных категорий
    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(project.specialization.toLowerCase());

    const matchesInvest =
      selectedInvest.length === 0 ||
      selectedInvest.some((inv) => {
        const range = investmentMapping[inv];
        const projectInv = parseInt(project.budget?.replace(/\D/g, "") || "0");
        return projectInv >= range.min && projectInv <= range.max;
      });
    return matchesSearch && matchesCategory && matchesInvest;
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    getAll();
  });
  return (
    <div className={styles["main"]}>
      <Search isValid={false} onChange={handleChange} />
      {investorDataSearch.length > 0 ? (
        <div className={styles["products"]}>
          {investorDataSearch.map((item, index) => (
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
          По вашему запросу инвесторы не найдены
        </div>
      )}
    </div>
  );
}
