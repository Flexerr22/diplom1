import { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import axios from "axios";
import { Container } from "../../components/Container/Container";
import styles from "./Favourites.module.css";
import { ProductProps } from "../../components/Product/Product";
import { Project } from "../../components/Project/Project";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { RolesGroupProps } from "../../components/RolesData/RolesData";
import { MyProjectUser } from "../../components/MyProjectUser/MyProjectUser";

function Favourites() {
  const [projects, setProjects] = useState<ProductProps[]>([]);
  const [projectsUser, setProjectsUser] = useState<RolesGroupProps[]>([]);

  const getMyProject = async () => {
    const jwt = Cookies.get("jwt");
    if (!jwt) {
      console.error("JWT-токен отсутствует");
      return;
    }

    const decoded = jwtDecode<{ sub: string }>(jwt);
    const user_id = parseInt(decoded.sub, 10);
    try {
      const response = await axios.get<ProductProps[]>(
        `http://127.0.0.1:8000/users/favorites/${user_id}?limit=10&offset=0`
      );
      setProjects(response.data);
    } catch (error) {
      console.error("Ошибка при загрузке проекта:", error);
    }
  };

  const getMyProjectUser = async () => {
    const jwt = Cookies.get("jwt");
    if (!jwt) {
      console.error("JWT-токен отсутствует");
      return;
    }

    const decoded = jwtDecode<{ sub: string }>(jwt);
    const user_id = parseInt(decoded.sub, 10);
    try {
      const response1 = await axios.get<RolesGroupProps[]>(
        `http://127.0.0.1:8000/mentors-investors/favorites/${user_id}?limit=10&offset=0`
      );
      setProjectsUser(response1.data);
    } catch (error) {
      console.error("Ошибка при загрузке проекта:", error);
    }
  };

  useEffect(() => {
    getMyProject();
    getMyProjectUser();
  }, []); // Пустой массив зависимостей

  return (
    <>
      <Header />
      <Container>
        {projects.length === 0 && projectsUser.length === 0 ? (
          <div className={styles.error}>
            Добавьте проекты или пользователей, которые вам понравились
          </div>
        ) : (
          <div className={styles.main}>
            <b className={styles.title}>Избранное</b>
            <div className={styles["products"]}>
              {projects.map((item, index) => (
                <Project
                  key={index}
                  id={item.id}
                  title={item.title}
                  tagline={item.tagline}
                  investment={item.investment}
                  category={item.category}
                  budget={item.budget}
                  experience={item.experience}
                  role={item.role}
                  description={item.description}
                  skills={item.skills}
                />
              ))}
            </div>
            <div className={styles["products"]}>
              {projectsUser.map((item, index) => (
                <MyProjectUser
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
        )}
      </Container>
    </>
  );
}

export default Favourites;
