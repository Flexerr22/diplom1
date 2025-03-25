import { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import axios from "axios";
import { Container } from "../../components/Container/Container";
import { useParams } from "react-router-dom";
import styles from "./MyProjects.module.css";
import { Product, ProductProps } from "../../components/Product/Product";

export function MyProjects() {
  const { user_id } = useParams<{ user_id: string }>();
  const [projects, setProjects] = useState<ProductProps[]>([]); // Используем массив

  useEffect(() => {
    const getMyProject = async () => {
      try {
        const response = await axios.get<ProductProps[]>(
          `http://127.0.0.1:8000/projects/my-projects/${user_id}`
        );
        console.log("Данные получены:", response.data); // Отладочный вывод
        setProjects(response.data);
      } catch (error) {
        console.error("Ошибка при загрузке проекта:", error);
      }
    };

    getMyProject();
  }, [user_id]);

  if (projects.length === 0) {
    return <div>Загрузка...</div>;
  }

  return (
    <>
      <Header />
      <Container>
        <div className={styles.main}>
          <b className={styles.title}>Мои проекты</b>
          <div className={styles["products"]}>
            {projects.map((item, index) => (
              <Product
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
        </div>
      </Container>
    </>
  );
}
