import { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import axios from "axios";
import { Container } from "../../components/Container/Container";
import { useParams } from "react-router-dom";
import styles from "./MyProjects.module.css";
import Button from "../../components/Button/Button";
import { MyProject } from "../../components/MyProject/MyProject";
import { ProductProps } from "../../types/projects.props";
import { Footer } from "../../components/Footer/Footer";

function MyProjects() {
  const { user_id } = useParams<{ user_id: string }>();
  const [projects, setProjects] = useState<ProductProps[]>([]);

  useEffect(() => {
    const getMyProject = async () => {
      try {
        const response = await axios.get<ProductProps[]>(
          `http://127.0.0.1:8000/projects/my-projects/${user_id}`
        );
        setProjects(response.data);
      } catch (error) {
        console.error("Ошибка при загрузке проекта:", error);
      }
    };

    getMyProject();
  }, [user_id]);

  return (
    <>
      <Header />
      <Container>
        {projects.length === 0 ? (
          <div className={styles.button}>
            <p>Создайте ваш первый проект</p>
            <a href="/add" className="button_project">
              <Button appearence="small" className="button_project">
                Добавить проект
              </Button>
            </a>
          </div>
        ) : (
          <div className={styles.main}>
            <b className={styles.title}>Мои проекты</b>
            <div className={styles["products"]}>
              {projects.map((item, index) => (
                <MyProject
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
        )}
      </Container>
      <Footer />
    </>
  );
}
export default MyProjects;
