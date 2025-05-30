import styles from "./MyProjectById.module.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../Header/Header";
import { Container } from "../Container/Container";
import Button from "../Button/Button";
import Cookies from "js-cookie";
import { CreateProjectRequest } from "../../types/projects.props";

export function MyProjectById() {
  const { project_id } = useParams<{ project_id: string }>();
  const [project, setProject] = useState<CreateProjectRequest | null>(null);
  const [editData, setEditData] = useState<CreateProjectRequest>({
    title: "",
    description: "",
    tagline: "",
    category: "",
    stage: "",
    investment: "",
    equity: "",
    investmentType: "",
    links: "",
    revenue: "",
    mentorExperience: "",
    mentorSkills: "",
    mentorWorkFormat: "",
    typeOfMentoring: "",
    experience: "",
    role: "",
    achievements: "",
    skills: "",
    budget: "",
    results: "",
    user_id: 0,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState<string>("");

  // Списки для выпадающих списков
  const categories = [
    "Программирование",
    "Дизайн",
    "Маркетинг",
    "Финансы",
    "Образование",
    "Медицина",
    "Искусство",
    "Строительство",
    "Наука",
    "Спорт",
  ];

  const stages = [
    "Идея",
    "Прототип",
    "Разработка",
    "Тестирование",
    "Запуск",
    "Масштабирование",
    "Поддержка",
    "Завершен",
  ];

  const investmentTypes = [
    "Ангельские инвестиции",
    "Венчурные инвестиции",
    "Краудфандинг",
    "Гранты",
    "Кредиты",
  ];

  const mentorWorkFormats = ["Онлайн", "Оффлайн", "Гибридный"];

  const mentoringTypes = [
    "Карьерное консультирование",
    "Техническое наставничество",
    "Бизнес-менторство",
    "Коучинг",
  ];

  const skillsList = [
    "Программирование",
    "Дизайн",
    "Аналитика данных",
    "Управление проектами",
    "Маркетинг",
  ];

  useEffect(() => {
    const role = Cookies.get("role");

    if (role) {
      setCurrentUserRole(role);
    }
  }, []);

  // Функция для валидации пробелов
  const validateSpaces = (value: string): string => {
    return value.replace(/\s{2,}/g, " ");
  };

  useEffect(() => {
    const getProjectById = async () => {
      try {
        const response = await axios.get<CreateProjectRequest>(
          `http://127.0.0.1:8000/projects/${project_id}`
        );
        setProject(response.data);
        setEditData(response.data);
      } catch (error) {
        console.error("Ошибка при загрузке проекта:", error);
      }
    };

    getProjectById();
  }, [project_id]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    const validatedValue = validateSpaces(value);
    setEditData((prev) => ({
      ...prev,
      [name]: validatedValue,
    }));
  };

  const editProject = async () => {
    try {
      const response = await axios.patch<CreateProjectRequest>(
        `http://127.0.0.1:8000/projects/update-project/${project_id}`,
        editData
      );
      setProject(response.data);
      setIsEditing(false);
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
            {/* Основная информация (отображается для всех ролей) */}
            <div className={styles.main_info}>
              <h2>{project.title}</h2>
              <p>Основная информация</p>
              <div className={styles.field}>
                <label>Название:</label>
                {isEditing && currentUserRole === "entrepreneur" ? (
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
                {isEditing && currentUserRole === "entrepreneur" ? (
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

            {/* Секции для предпринимателя */}
            {currentUserRole === "entrepreneur" && (
              <>
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
                          <select
                            name="category"
                            value={editData.category}
                            onChange={handleInputChange}
                            className={styles.input}
                            required
                          >
                            <option value="" disabled>
                              Выберите категорию
                            </option>
                            {categories.map((category, index) => (
                              <option key={index} value={category}>
                                {category}
                              </option>
                            ))}
                          </select>
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
                          <select
                            name="stage"
                            value={editData.stage}
                            onChange={handleInputChange}
                            className={styles.input}
                            required
                          >
                            <option value="" disabled>
                              Выберите стадию
                            </option>
                            {stages.map((stage, index) => (
                              <option key={index} value={stage}>
                                {stage}
                              </option>
                            ))}
                          </select>
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
                          <select
                            name="investmentType"
                            value={editData.investmentType}
                            onChange={handleInputChange}
                            className={styles.input}
                            required
                          >
                            <option value="" disabled>
                              Выберите тип инвестиций
                            </option>
                            {investmentTypes.map((type, index) => (
                              <option key={index} value={type}>
                                {type}
                              </option>
                            ))}
                          </select>
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
                          <select
                            name="mentorWorkFormat"
                            value={editData.mentorWorkFormat}
                            onChange={handleInputChange}
                            className={styles.input}
                            required
                          >
                            <option value="" disabled>
                              Выберите формат работы
                            </option>
                            {mentorWorkFormats.map((format, index) => (
                              <option key={index} value={format}>
                                {format}
                              </option>
                            ))}
                          </select>
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
              </>
            )}

            {/* Секция для наставника */}
            {currentUserRole === "mentor" && (
              <div>
                <p>Информация о наставнике</p>
                <div className={styles.inputs}>
                  {project.typeOfMentoring && (
                    <div className={styles.field}>
                      <label>Тип менторства:</label>
                      {isEditing ? (
                        <select
                          name="typeOfMentoring"
                          value={editData.typeOfMentoring}
                          onChange={handleInputChange}
                          className={styles.input}
                          required
                        >
                          <option value="" disabled>
                            Выберите тип менторства
                          </option>
                          {mentoringTypes.map((type, index) => (
                            <option key={index} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
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
                  )}
                  {project.experience && (
                    <div className={styles.field}>
                      <label>Стаж работы в проекте:</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="experience"
                          value={editData.experience}
                          onChange={handleInputChange}
                          className={styles.input}
                          placeholder="Опыт работы"
                          required
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
                        <select
                          name="skills"
                          value={editData.skills}
                          onChange={handleInputChange}
                          className={styles.input}
                          required
                        >
                          <option value="" disabled>
                            Выберите навыки
                          </option>
                          {skillsList.map((skill, index) => (
                            <option key={index} value={skill}>
                              {skill}
                            </option>
                          ))}
                        </select>
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
                        required
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

            {/* Секция для инвестора */}
            {currentUserRole === "investor" && (
              <div>
                <p>Информация об инвесторе</p>
                <div className={styles.inputs}>
                  {project.budget && (
                    <div className={styles.field}>
                      <label>Выделенный бюджет:</label>
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

            {/* Кнопки редактирования */}
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
                {currentUserRole === "entrepreneur"
                  ? "Редактировать проект"
                  : currentUserRole === "investor"
                  ? "Редактировать информацию инвестора"
                  : "Редактировать информацию наставника"}
              </Button>
            )}
          </div>
        </div>
      </Container>
    </>
  );
}
