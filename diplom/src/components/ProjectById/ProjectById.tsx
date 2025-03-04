import styles from "./ProjectById.module.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export interface ProductProps {
  title: string;
  tagline: string;
  category: string;
  investment: string;
  stage: string;
}

export function ProjectById() {
  const { project_id } = useParams<{ project_id: string }>();
  const [project, setProject] = useState<ProductProps | null>(null);

  useEffect(() => {
    const getProjectById = async () => {
      try {
        const response = await axios.get<ProductProps>(
          `http://127.0.0.1:8000/projects/${project_id}`
        );
        setProject(response.data);
      } catch (error) {
        console.error("Ошибка при загрузке проекта:", error);
      }
    };

    getProjectById();
  }, [project_id]);

  if (!project) {
    return <div>Загрузка...</div>;
  }

  return (
    <div>
      <div className={styles["product"]}>
        <p>{project.title}</p>
      </div>
    </div>
  );
}
