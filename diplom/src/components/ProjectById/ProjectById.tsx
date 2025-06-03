import styles from "./ProjectById.module.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../Header/Header";
import { Container } from "../Container/Container";
import { CreateProjectRequest } from "../../types/projects.props";

export function ProjectById() {
  const { project_id } = useParams<{ project_id: string }>();
  const [project, setProject] = useState<CreateProjectRequest | null>(null);

  const formatNumber = (value: number | string): string => {
    // Если значение - строка, пытаемся преобразовать в число
    const numberValue = typeof value === 'string' 
      ? parseFloat(value) 
      : value;
    
    // Проверяем, является ли значение числом
    if (isNaN(numberValue)) {
      return value.toString();
    }
    
    // Форматируем число с разделителями тысяч
    return numberValue.toLocaleString('ru-RU', {
      maximumFractionDigits: 2
    });
  };

  useEffect(() => {
    const getProjectById = async () => {
      try {
        const response = await axios.get<CreateProjectRequest>(
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
    <>
      <Header />
      <Container>
        <div className={styles.main}>
          <div className={styles.form}>
            <h2>{project.title}</h2>
            <div className={styles.main_info}>
              <p>Основная информация</p>
              <div className={styles.field}>
                <label>Описание:</label>
                <textarea
                  value={project.description}
                  readOnly
                  className={styles.textarea}
                  placeholder="Описание"
                />
              </div>
            </div>
            {project.tagline && (
              <>
                <div className={styles.main_details}>
                  <p>Основные детали проекта</p>

                  <div className={styles.field}>
                    <label>Краткое описание:</label>
                    <textarea
                      value={project.tagline}
                      readOnly
                      className={styles.textarea}
                      placeholder="Краткое описание"
                    />
                  </div>

                  <div className={styles.inputs}>
                    {project.category && (
                      <div className={styles.field}>
                        <label>Категория:</label>
                        <input
                          type="text"
                          value={project.category}
                          readOnly
                          className={styles.input}
                          placeholder="Категория"
                        />
                      </div>
                    )}
                    {project.stage && (
                      <div className={styles.field}>
                        <label>Стадия:</label>
                        <input
                          type="text"
                          value={project.stage}
                          readOnly
                          className={styles.input}
                          placeholder="Стадия"
                        />
                      </div>
                    )}
                    {project.links && (
                      <div className={styles.field}>
                        <label>Ссылки:</label>
                        <input
                          value={project.links}
                          readOnly
                          className={styles.textarea}
                          placeholder="Ссылки"
                        />
                      </div>
                    )}
                    {project.revenue && (
                      <div className={styles.field}>
                        <label>Выручка (в руб.):</label>
                        <input
                          type="text"
                          value={`${formatNumber(project.revenue)} ₽`}
                          readOnly
                          className={styles.input}
                          placeholder="Выручка"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
            {project.investment && (
              <>
                <div>
                  <p>Для инвесторов</p>
                  <div className={styles.inputs}>
                    <div className={styles.field}>
                      <label>Инвестиции (в руб.):</label>
                      <input
                        type="text"
                        value={`${formatNumber(project.investment)} ₽`}
                        readOnly
                        className={styles.input}
                        placeholder="Инвестиции"
                      />
                    </div>
                    {project.equity && (
                      <div className={styles.field}>
                        <label>Доля:</label>
                        <input
                          type="text"
                          value={`${project.equity} %`}
                          readOnly
                          className={styles.input}
                          placeholder="Доля"
                        />
                      </div>
                    )}
                    {project.investmentType && (
                      <div className={styles.field}>
                        <label>Тип инвестиций:</label>
                        <input
                          type="text"
                          value={project.investmentType}
                          readOnly
                          className={styles.input}
                          placeholder="Тип инвестиций"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
            {project.mentorExperience && (
              <>
                <div>
                  <p>Ожидания от наставника</p>
                  <div className={styles.inputs}>
                    <div className={styles.field}>
                      <label>Опыт ментора (в мес.):</label>
                      <input
                        type="text"
                        value={`${project.mentorExperience} мес.`}
                        readOnly
                        className={styles.input}
                        placeholder="Опыт ментора"
                      />
                    </div>

                    {project.mentorSkills && (
                      <div className={styles.field}>
                        <label>Навыки ментора:</label>
                        <input
                          type="text"
                          value={project.mentorSkills}
                          readOnly
                          className={styles.input}
                          placeholder="Навыки ментора"
                        />
                      </div>
                    )}
                    {project.mentorWorkFormat && (
                      <div className={styles.field}>
                        <label>Формат работы:</label>
                        <input
                          type="text"
                          value={project.mentorWorkFormat}
                          readOnly
                          className={styles.input}
                          placeholder="Формат работы"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {project.typeOfMentoring && (
              <div>
                <p>Информация о наставнике</p>
                <div className={styles.inputs}>
                  <div className={styles.field}>
                    <label>Тип менторства:</label>
                    <input
                      type="text"
                      value={project.typeOfMentoring}
                      readOnly
                      className={styles.input}
                      placeholder="Тип менторства"
                    />
                  </div>
                  {project.experience && (
                    <div className={styles.field}>
                      <label>Опыт (в мес.):</label>
                      <input
                        type="text"
                        value={`${project.experience} мес.`}
                        readOnly
                        className={styles.input}
                        placeholder="Опыт"
                      />
                    </div>
                  )}
                  {project.skills && (
                    <div className={styles.field}>
                      <label>Навыки:</label>
                      <input
                        type="text"
                        value={project.skills}
                        readOnly
                        className={styles.input}
                        placeholder="Навыки"
                      />
                    </div>
                  )}
                </div>
                {project.achievements && (
                  <div className={styles.field}>
                    <label>Достижения:</label>
                    <textarea
                      value={project.achievements}
                      readOnly
                      className={styles.textarea}
                      placeholder="Достижения"
                    />
                  </div>
                )}
              </div>
            )}
            {project.budget && (
              <>
                <div>
                  <p>Информация об инвесторе</p>
                  <div className={styles.inputs}>
                    <div className={styles.field}>
                      <label>Выделенный бюджет (в руб.):</label>
                      <input
                        type="text"
                        value={`${project.budget} ₽`}
                        readOnly
                        className={styles.input}
                        placeholder="Бюджет"
                      />
                    </div>
                  </div>
                  {project.results && (
                    <div className={styles.field}>
                      <label>Результаты:</label>
                      <textarea
                        value={project.results}
                        readOnly
                        className={styles.textarea}
                        placeholder="Результаты"
                      />
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </Container>
    </>
  );
}
