import axios from "axios";
import Search from "../Search/Search";
import styles from "./RolesGroup.module.css";
import { useEffect, useState } from "react";
import { RolesData, RolesGroupProps } from "../RolesData/RolesData";

export function RolesGroup() {
  const [users, setUsers] = useState<RolesGroupProps[]>([]);

  const getAll = async () => {
    await axios
      .get<RolesGroupProps[]>("http://127.0.0.1:8000/users")
      .then((responce) => setUsers(responce.data));
  };
  const mentorData = users.filter((prev) => prev.role === "mentor");
  const investorData = users.filter((prev) => prev.role === "investor");
  useEffect(() => {
    getAll();
  });
  return (
    <div className={styles["main"]}>
      <Search isValid={false} />
      <div className={styles["products"]}>
        {mentorData.map((item, index) => (
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
    </div>
  );
}
