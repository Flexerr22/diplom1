import axios from "axios";
import Search from "../Search/Search";
import styles from "./RolesGroupMentor.module.css";
import { useEffect, useState } from "react";
import { RolesData } from "../RolesData/RolesData";
import { RolesGroupProps } from "../../helpers/projects.props";

export function RolesGroupMentor() {
  const [users, setUsers] = useState<RolesGroupProps[]>([]);
  const [search, setSearch] = useState("");

  const getAll = async () => {
    await axios
      .get<RolesGroupProps[]>("http://127.0.0.1:8000/users")
      .then((responce) => setUsers(responce.data));
  };
  const mentorData = users.filter((prev) => prev.role === "mentor");

  const mentorDataSearch = mentorData.filter((user) =>
    user.specialization.toLowerCase().includes(search.toLowerCase())
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    getAll();
  });
  return (
    <div className={styles["main"]}>
      <Search isValid={false} onChange={handleSearch} />
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
    </div>
  );
}
