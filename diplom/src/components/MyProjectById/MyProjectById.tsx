import styles from "./MyProjectById.module.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../Header/Header";
import { Container } from "../Container/Container";
import Button from "../Button/Button";

export interface ProductByIdProps {
  title: string;
  description: string;
  tagline?: string;
  category?: string;
  stage?: string;
  investment?: string;
  equity?: string;
  investmentType?: string;
  team?: string;
  links?: string;
  revenue?: string;
  goals?: string;
  problem?: string;
  solution?: string;
  targetAudience?: string;
  risks?: string;
  mentorExperience?: string;
  mentorSkills?: string;
  mentorWorkFormat?: string;
  mentorCollaborationGoals?: string;
  mentorCollaborationTerms?: string;
  typeOfMentoring?: string;
  experience?: string;
  role?: string;
  achievements?: string;
  skills?: string;
  typeOfInvestment?: string;
  budget?: string;
  results?: string;
  user_id?: number;
}

export function MyProjectById() {
  const { project_id } = useParams<{ project_id: string }>();
  const [project, setProject] = useState<ProductByIdProps | null>(null);
  const [editData, setEditData] = useState<ProductByIdProps>({
    title: "",
    description: "",
    tagline: "",
    category: "",
    stage: "",
    investment: "",
    equity: "",
    investmentType: "",
    team: "",
    links: "",
    revenue: "",
    goals: "",
    problem: "",
    solution: "",
    targetAudience: "",
    risks: "",
    mentorExperience: "",
    mentorSkills: "",
    mentorWorkFormat: "",
    mentorCollaborationGoals: "",
    mentorCollaborationTerms: "",
    typeOfMentoring: "",
    experience: "",
    role: "",
    achievements: "",
    skills: "",
    typeOfInvestment: "",
    budget: "",
    results: "",
    user_id: 0,
  });
  const [isEditing, setIsEditing] = useState(false); // Состояние для режима редактирования

  useEffect(() => {
    const getProjectById = async () => {
      try {
        const response = await axios.get<ProductByIdProps>(
          `http://127.0.0.1:8000/projects/${project_id}`
        );
        setProject(response.data);
        setEditData(response.data); // Инициализируем editData данными проекта
      } catch (error) {
        console.error("Ошибка при загрузке проекта:", error);
      }
    };

    getProjectById();
  }, [project_id]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const editProject = async () => {
    try {
      const response = await axios.patch<ProductByIdProps>(
        `http://127.0.0.1:8000/projects/update-project/${project_id}`,
        editData
      );
      setProject(response.data); // Обновляем данные проекта
      setIsEditing(false); // Выходим из режима редактирования
      alert("Проект успешно обновлен!");
    } catch (error) {
      console.error("Ошибка при обновлении проекта:", error);
      alert("Не удалось обновить проект.");
    }
  };

  if (!project) {
    return <div>Загрузка...</div>;
  }

  return (
    <>
      <Header />
      <Container>
        <div className={styles.main}>
          <div className={styles.form}>
            <div className={styles.main_info}>
              <h2>{project.title}</h2>
              <p>Основная информация</p>
              <div className={styles.field}>
                <label>Название:</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="title"
                    value={editData.title}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="Название"
                  />
                ) : (
                  <input
                    type="text"
                    value={project.title}
                    readOnly
                    className={styles.input}
                    placeholder="Название"
                  />
                )}
              </div>
              <div className={styles.field}>
                <label>Описание:</label>
                {isEditing ? (
                  <textarea
                    name="description"
                    value={editData.description}
                    onChange={handleInputChange}
                    className={styles.textarea}
                    placeholder="Описание"
                  />
                ) : (
                  <textarea
                    value={project.description}
                    readOnly
                    className={styles.textarea}
                    placeholder="Описание"
                  />
                )}
              </div>
            </div>

            <div className={styles.main_details}>
              <p>Основные детали проекта</p>
              {project.tagline && (
                <div className={styles.field}>
                  <label>Краткое описание:</label>
                  {isEditing ? (
                    <textarea
                      name="tagline"
                      value={editData.tagline}
                      onChange={handleInputChange}
                      className={styles.textarea}
                      placeholder="Краткое описание"
                    />
                  ) : (
                    <textarea
                      value={project.tagline}
                      readOnly
                      className={styles.textarea}
                      placeholder="Краткое описание"
                    />
                  )}
                </div>
              )}
              <div className={styles.inputs}>
                {project.category && (
                  <div className={styles.field}>
                    <label>Категория:</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="category"
                        value={editData.category}
                        onChange={handleInputChange}
                        className={styles.input}
                        placeholder="Категория"
                      />
                    ) : (
                      <input
                        type="text"
                        value={project.category}
                        readOnly
                        className={styles.input}
                        placeholder="Категория"
                      />
                    )}
                  </div>
                )}
                {project.stage && (
                  <div className={styles.field}>
                    <label>Стадия:</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="stage"
                        value={editData.stage}
                        onChange={handleInputChange}
                        className={styles.input}
                        placeholder="Стадия"
                      />
                    ) : (
                      <input
                        type="text"
                        value={project.stage}
                        readOnly
                        className={styles.input}
                        placeholder="Стадия"
                      />
                    )}
                  </div>
                )}
                {project.links && (
                  <div className={styles.field}>
                    <label>Ссылки:</label>
                    {isEditing ? (
                      <input
                        name="links"
                        value={editData.links}
                        onChange={handleInputChange}
                        className={styles.textarea}
                        placeholder="Ссылки"
                      />
                    ) : (
                      <input
                        value={project.links}
                        readOnly
                        className={styles.textarea}
                        placeholder="Ссылки"
                      />
                    )}
                  </div>
                )}
                {project.revenue && (
                  <div className={styles.field}>
                    <label>Выручка:</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="revenue"
                        value={editData.revenue}
                        onChange={handleInputChange}
                        className={styles.input}
                        placeholder="Выручка"
                      />
                    ) : (
                      <input
                        type="text"
                        value={project.revenue}
                        readOnly
                        className={styles.input}
                        placeholder="Выручка"
                      />
                    )}
                  </div>
                )}
              </div>
            </div>

            <div>
              <p>Для инвесторов</p>
              <div className={styles.inputs}>
                {project.investment && (
                  <div className={styles.field}>
                    <label>Инвестиции:</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="investment"
                        value={editData.investment}
                        onChange={handleInputChange}
                        className={styles.input}
                        placeholder="Инвестиции"
                      />
                    ) : (
                      <input
                        type="text"
                        value={project.investment}
                        readOnly
                        className={styles.input}
                        placeholder="Инвестиции"
                      />
                    )}
                  </div>
                )}
                {project.equity && (
                  <div className={styles.field}>
                    <label>Доля:</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="equity"
                        value={editData.equity}
                        onChange={handleInputChange}
                        className={styles.input}
                        placeholder="Доля"
                      />
                    ) : (
                      <input
                        type="text"
                        value={project.equity}
                        readOnly
                        className={styles.input}
                        placeholder="Доля"
                      />
                    )}
                  </div>
                )}
                {project.investmentType && (
                  <div className={styles.field}>
                    <label>Тип инвестиций:</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="investmentType"
                        value={editData.investmentType}
                        onChange={handleInputChange}
                        className={styles.input}
                        placeholder="Тип инвестиций"
                      />
                    ) : (
                      <input
                        type="text"
                        value={project.investmentType}
                        readOnly
                        className={styles.input}
                        placeholder="Тип инвестиций"
                      />
                    )}
                  </div>
                )}
              </div>
            </div>

            <div>
              <p>Ожидания от наставника</p>
              <div className={styles.inputs}>
                {project.mentorExperience && (
                  <div className={styles.field}>
                    <label>Опыт ментора:</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="mentorExperience"
                        value={editData.mentorExperience}
                        onChange={handleInputChange}
                        className={styles.input}
                        placeholder="Опыт ментора"
                      />
                    ) : (
                      <input
                        type="text"
                        value={project.mentorExperience}
                        readOnly
                        className={styles.input}
                        placeholder="Опыт ментора"
                      />
                    )}
                  </div>
                )}
                {project.mentorSkills && (
                  <div className={styles.field}>
                    <label>Навыки ментора:</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="mentorSkills"
                        value={editData.mentorSkills}
                        onChange={handleInputChange}
                        className={styles.input}
                        placeholder="Навыки ментора"
                      />
                    ) : (
                      <input
                        type="text"
                        value={project.mentorSkills}
                        readOnly
                        className={styles.input}
                        placeholder="Навыки ментора"
                      />
                    )}
                  </div>
                )}
                {project.mentorWorkFormat && (
                  <div className={styles.field}>
                    <label>Формат работы:</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="mentorWorkFormat"
                        value={editData.mentorWorkFormat}
                        onChange={handleInputChange}
                        className={styles.input}
                        placeholder="Формат работы"
                      />
                    ) : (
                      <input
                        type="text"
                        value={project.mentorWorkFormat}
                        readOnly
                        className={styles.input}
                        placeholder="Формат работы"
                      />
                    )}
                  </div>
                )}
              </div>
            </div>

            <div>
              <p>Дополнительные детали проекта</p>
              <div className={styles.textareas}>
                {project.team && (
                  <div className={styles.field}>
                    <label>Команда:</label>
                    {isEditing ? (
                      <textarea
                        name="team"
                        value={editData.team}
                        onChange={handleInputChange}
                        className={styles.textarea}
                        placeholder="Команда"
                      />
                    ) : (
                      <textarea
                        value={project.team}
                        readOnly
                        className={styles.textarea}
                        placeholder="Команда"
                      />
                    )}
                  </div>
                )}
                {project.goals && (
                  <div className={styles.field}>
                    <label>Цели:</label>
                    {isEditing ? (
                      <textarea
                        name="goals"
                        value={editData.goals}
                        onChange={handleInputChange}
                        className={styles.textarea}
                        placeholder="Цели"
                      />
                    ) : (
                      <textarea
                        value={project.goals}
                        readOnly
                        className={styles.textarea}
                        placeholder="Цели"
                      />
                    )}
                  </div>
                )}
                {project.problem && (
                  <div className={styles.field}>
                    <label>Проблема:</label>
                    {isEditing ? (
                      <textarea
                        name="problem"
                        value={editData.problem}
                        onChange={handleInputChange}
                        className={styles.textarea}
                        placeholder="Проблема"
                      />
                    ) : (
                      <textarea
                        value={project.problem}
                        readOnly
                        className={styles.textarea}
                        placeholder="Проблема"
                      />
                    )}
                  </div>
                )}
                {project.solution && (
                  <div className={styles.field}>
                    <label>Решение:</label>
                    {isEditing ? (
                      <textarea
                        name="solution"
                        value={editData.solution}
                        onChange={handleInputChange}
                        className={styles.textarea}
                        placeholder="Решение"
                      />
                    ) : (
                      <textarea
                        value={project.solution}
                        readOnly
                        className={styles.textarea}
                        placeholder="Решение"
                      />
                    )}
                  </div>
                )}
                {project.targetAudience && (
                  <div className={styles.field}>
                    <label>Целевая аудитория:</label>
                    {isEditing ? (
                      <textarea
                        name="targetAudience"
                        value={editData.targetAudience}
                        onChange={handleInputChange}
                        className={styles.textarea}
                        placeholder="Целевая аудитория"
                      />
                    ) : (
                      <textarea
                        value={project.targetAudience}
                        readOnly
                        className={styles.textarea}
                        placeholder="Целевая аудитория"
                      />
                    )}
                  </div>
                )}
                {project.risks && (
                  <div className={styles.field}>
                    <label>Риски:</label>
                    {isEditing ? (
                      <textarea
                        name="risks"
                        value={editData.risks}
                        onChange={handleInputChange}
                        className={styles.textarea}
                        placeholder="Риски"
                      />
                    ) : (
                      <textarea
                        value={project.risks}
                        readOnly
                        className={styles.textarea}
                        placeholder="Риски"
                      />
                    )}
                  </div>
                )}
              </div>
            </div>

            {project.typeOfMentoring && (
              <div>
                <p>Информация о наставнике</p>
                <div className={styles.inputs}>
                  <div className={styles.field}>
                    <label>Тип менторства:</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="typeOfMentoring"
                        value={editData.typeOfMentoring}
                        onChange={handleInputChange}
                        className={styles.input}
                        placeholder="Тип менторства"
                      />
                    ) : (
                      <input
                        type="text"
                        value={project.typeOfMentoring}
                        readOnly
                        className={styles.input}
                        placeholder="Тип менторства"
                      />
                    )}
                  </div>
                  {project.experience && (
                    <div className={styles.field}>
                      <label>Опыт:</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="experience"
                          value={editData.experience}
                          onChange={handleInputChange}
                          className={styles.input}
                          placeholder="Опыт"
                        />
                      ) : (
                        <input
                          type="text"
                          value={project.experience}
                          readOnly
                          className={styles.input}
                          placeholder="Опыт"
                        />
                      )}
                    </div>
                  )}
                  {project.skills && (
                    <div className={styles.field}>
                      <label>Навыки:</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="skills"
                          value={editData.skills}
                          onChange={handleInputChange}
                          className={styles.input}
                          placeholder="Навыки"
                        />
                      ) : (
                        <input
                          type="text"
                          value={project.skills}
                          readOnly
                          className={styles.input}
                          placeholder="Навыки"
                        />
                      )}
                    </div>
                  )}
                </div>
                {project.achievements && (
                  <div className={styles.field}>
                    <label>Достижения:</label>
                    {isEditing ? (
                      <textarea
                        name="achievements"
                        value={editData.achievements}
                        onChange={handleInputChange}
                        className={styles.textarea}
                        placeholder="Достижения"
                      />
                    ) : (
                      <textarea
                        value={project.achievements}
                        readOnly
                        className={styles.textarea}
                        placeholder="Достижения"
                      />
                    )}
                  </div>
                )}
              </div>
            )}

            {project.typeOfInvestment && (
              <div>
                <p>Информация об инвесторе</p>
                <div className={styles.inputs}>
                  <div className={styles.field}>
                    <label>Тип инвестиций:</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="typeOfInvestment"
                        value={editData.typeOfInvestment}
                        onChange={handleInputChange}
                        className={styles.input}
                        placeholder="Тип инвестиций"
                      />
                    ) : (
                      <input
                        type="text"
                        value={project.typeOfInvestment}
                        readOnly
                        className={styles.input}
                        placeholder="Тип инвестиций"
                      />
                    )}
                  </div>
                  {project.budget && (
                    <div className={styles.field}>
                      <label>Бюджет:</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="budget"
                          value={editData.budget}
                          onChange={handleInputChange}
                          className={styles.input}
                          placeholder="Бюджет"
                        />
                      ) : (
                        <input
                          type="text"
                          value={project.budget}
                          readOnly
                          className={styles.input}
                          placeholder="Бюджет"
                        />
                      )}
                    </div>
                  )}
                  {project.role && (
                    <div className={styles.field}>
                      <label>Роль:</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="role"
                          value={editData.role}
                          onChange={handleInputChange}
                          className={styles.input}
                          placeholder="Роль"
                        />
                      ) : (
                        <input
                          type="text"
                          value={project.role}
                          readOnly
                          className={styles.input}
                          placeholder="Роль"
                        />
                      )}
                    </div>
                  )}
                </div>
                {project.results && (
                  <div className={styles.field}>
                    <label>Результаты:</label>
                    {isEditing ? (
                      <textarea
                        name="results"
                        value={editData.results}
                        onChange={handleInputChange}
                        className={styles.textarea}
                        placeholder="Результаты"
                      />
                    ) : (
                      <textarea
                        value={project.results}
                        readOnly
                        className={styles.textarea}
                        placeholder="Результаты"
                      />
                    )}
                  </div>
                )}
              </div>
            )}

            {isEditing ? (
              <div className={styles.edit_buttons}>
                <Button
                  className={styles["button_product"]}
                  onClick={editProject}
                >
                  Сохранить изменения
                </Button>
                <Button
                  className={styles["button_product"]}
                  onClick={() => setIsEditing(false)}
                >
                  Отмена
                </Button>
              </div>
            ) : (
              <Button
                className={styles["button_product"]}
                onClick={() => setIsEditing(true)}
              >
                Редактировать проект
              </Button>
            )}
          </div>
        </div>
      </Container>
    </>
  );
}
