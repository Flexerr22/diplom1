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
  const [errors, setErrors] = useState<Record<string, string>>({});

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

  const formatNumber = (value: number | string | undefined): string => {
    if (value === undefined || value === null) return "";

    // Если значение - строка, пытаемся преобразовать в число
    const numberValue = typeof value === "string" ? parseFloat(value) : value;

    // Проверяем, является ли значение числом
    if (isNaN(numberValue)) {
      return value.toString();
    }

    // Форматируем число с разделителями тысяч
    return numberValue.toLocaleString("ru-RU", {
      maximumFractionDigits: 2,
    });
  };

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

  // Проверка числовых значений
  const validateNumber = (
    value: string,
    name: string,
    min: number = 0,
    max: number = Infinity
  ): string => {
    const numValue = parseFloat(value);

    if (isNaN(numValue)) {
      return "Должно быть числом";
    }

    if (numValue < min) {
      return `Не может быть меньше ${min}`;
    }

    if (numValue > max) {
      return `Не может быть больше ${max}`;
    }

    return "";
  };

  const validateSpecialChars = (value: string, fieldName: string): boolean => {
    // Для поля links разрешаем все символы
    if (fieldName === "links") {
      return true;
    }

    // Разрешаем буквы, цифры, пробелы и основные знаки препинания
    const regex = /^[a-zA-Zа-яА-ЯёЁ0-9\s.,!?()%:\-@]*$/;
    return regex.test(value);
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    // Проверяем на допустимые символы
    if (!validateSpecialChars(value, name)) {
      setErrors((prev) => ({
        ...prev,
        [name]: "Недопустимые символы в поле",
      }));
      return;
    }

    const validatedValue = validateSpaces(value);

    // Сбрасываем ошибку для текущего поля
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    // Валидация чисел в реальном времени
    if (
      [
        "investment",
        "equity",
        "revenue",
        "mentorExperience",
        "experience",
        "budget",
      ].includes(name)
    ) {
      let errorMsg = "";

      if (value.trim() !== "") {
        if (name === "equity") {
          errorMsg = validateNumber(value, name, 0, 100);
        } else {
          errorMsg = validateNumber(value, name);
        }
      }

      if (errorMsg) {
        setErrors((prev) => ({ ...prev, [name]: errorMsg }));
      }
    }

    setEditData((prev) => ({
      ...prev,
      [name as keyof CreateProjectRequest]: validatedValue,
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    // Валидация общих полей
    if (!editData.title.trim()) {
      newErrors.title = "Название обязательно";
      isValid = false;
    }
    if (!editData.description.trim()) {
      newErrors.description = "Описание обязательно";
      isValid = false;
    }

    // Валидация для предпринимателя
    if (currentUserRole === "entrepreneur") {
      if (!editData.tagline?.trim()) {
        newErrors.tagline = "Краткое описание обязательно";
        isValid = false;
      }
      if (!editData.category) {
        newErrors.category = "Категория обязательна";
        isValid = false;
      }
      if (!editData.stage) {
        newErrors.stage = "Стадия обязательна";
        isValid = false;
      }

      // Числовые поля
      const numberFields = [
        { name: "investment", min: 0, max: Infinity },
        { name: "equity", min: 0, max: 100 },
        { name: "revenue", min: 0, max: Infinity },
        { name: "mentorExperience", min: 0, max: Infinity },
      ];

      numberFields.forEach((field) => {
        const value = editData[field.name as keyof CreateProjectRequest];
        if (value === undefined || value === null || value === "") {
          newErrors[field.name] = "Поле обязательно";
          isValid = false;
        } else {
          const error = validateNumber(
            value.toString(),
            field.name,
            field.min,
            field.max
          );
          if (error) {
            newErrors[field.name] = error;
            isValid = false;
          }
        }
      });

      if (!editData.investmentType) {
        newErrors.investmentType = "Тип инвестиций обязателен";
        isValid = false;
      }
      if (!editData.mentorSkills?.trim()) {
        newErrors.mentorSkills = "Навыки ментора обязательны";
        isValid = false;
      }
      if (!editData.mentorWorkFormat) {
        newErrors.mentorWorkFormat = "Формат работы обязателен";
        isValid = false;
      }
    }

    // Валидация для наставника
    if (currentUserRole === "mentor") {
      if (!editData.typeOfMentoring) {
        newErrors.typeOfMentoring = "Тип менторства обязателен";
        isValid = false;
      }
      if (!editData.experience) {
        newErrors.experience = "Опыт обязателен";
        isValid = false;
      } else {
        const error = validateNumber(
          editData.experience.toString(),
          "experience",
          0
        );
        if (error) {
          newErrors.experience = error;
          isValid = false;
        }
      }
      if (!editData.skills) {
        newErrors.skills = "Навыки обязательны";
        isValid = false;
      }
      if (!editData.achievements?.trim()) {
        newErrors.achievements = "Достижения обязательны";
        isValid = false;
      }
    }

    // Валидация для инвестора
    if (currentUserRole === "investor") {
      if (!editData.budget) {
        newErrors.budget = "Бюджет обязателен";
        isValid = false;
      } else {
        const error = validateNumber(editData.budget.toString(), "budget", 0);
        if (error) {
          newErrors.budget = error;
          isValid = false;
        }
      }
      if (!editData.results?.trim()) {
        newErrors.results = "Результаты обязательны";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const editProject = async () => {
    if (!validateForm()) {
      return;
    }
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
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      name="title"
                      value={editData.title}
                      onChange={handleInputChange}
                      className={styles.input}
                      placeholder="Название"
                      required
                    />
                    {errors.title && (
                      <div className={styles.error}>{errors.title}</div>
                    )}
                  </>
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
                  <>
                    <textarea
                      name="description"
                      value={editData.description}
                      onChange={handleInputChange}
                      className={styles.textarea}
                      placeholder="Описание"
                      required
                    />
                    {errors.description && (
                      <div className={styles.error}>{errors.description}</div>
                    )}
                  </>
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
                  {(isEditing || project.tagline) && (
                    <div className={styles.field}>
                      <label>Краткое описание:</label>
                      {isEditing ? (
                        <>
                          <textarea
                            name="tagline"
                            value={editData.tagline}
                            onChange={handleInputChange}
                            className={styles.textarea}
                            placeholder="Краткое описание"
                            required
                          />
                          {errors.tagline && (
                            <div className={styles.error}>{errors.tagline}</div>
                          )}
                        </>
                      ) : (
                        <textarea
                          value={project.tagline || ""}
                          readOnly
                          className={styles.textarea}
                          placeholder="Краткое описание"
                        />
                      )}
                    </div>
                  )}
                  <div className={styles.inputs}>
                    {(isEditing || project.category) && (
                      <div className={styles.field}>
                        <label>Категория:</label>
                        {isEditing ? (
                          <>
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
                            {errors.category && (
                              <div className={styles.error}>
                                {errors.category}
                              </div>
                            )}
                          </>
                        ) : (
                          <input
                            type="text"
                            value={project.category || ""}
                            readOnly
                            className={styles.input}
                            placeholder="Категория"
                          />
                        )}
                      </div>
                    )}
                    {(isEditing || project.stage) && (
                      <div className={styles.field}>
                        <label>Стадия:</label>
                        {isEditing ? (
                          <>
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
                            {errors.stage && (
                              <div className={styles.error}>{errors.stage}</div>
                            )}
                          </>
                        ) : (
                          <input
                            type="text"
                            value={project.stage || ""}
                            readOnly
                            className={styles.input}
                            placeholder="Стадия"
                          />
                        )}
                      </div>
                    )}
                    {(isEditing || project.links) && (
                      <div className={styles.field}>
                        <label>Ссылки:</label>
                        {isEditing ? (
                          <input
                            name="links"
                            value={editData.links || ""}
                            onChange={handleInputChange}
                            className={styles.textarea}
                            placeholder="Ссылки"
                          />
                        ) : (
                          <input
                            value={project.links || ""}
                            readOnly
                            className={styles.textarea}
                            placeholder="Ссылки"
                          />
                        )}
                      </div>
                    )}
                    {(isEditing || project.revenue) && (
                      <div className={styles.field}>
                        <label>Выручка (в руб.):</label>
                        {isEditing ? (
                          <>
                            <input
                              type="text"
                              name="revenue"
                              value={editData.revenue}
                              onChange={handleInputChange}
                              className={styles.input}
                              placeholder="Выручка"
                              required
                            />
                            {errors.revenue && (
                              <div className={styles.error}>
                                {errors.revenue}
                              </div>
                            )}
                          </>
                        ) : (
                          <input
                            type="text"
                            value={`${formatNumber(project.revenue)} ₽`}
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
                    {(isEditing || project.investment) && (
                      <div className={styles.field}>
                        <label>Инвестиции (в руб.):</label>
                        {isEditing ? (
                          <>
                            <input
                              type="text"
                              name="investment"
                              value={editData.investment}
                              onChange={handleInputChange}
                              className={styles.input}
                              placeholder="Инвестиции"
                              required
                            />
                            {errors.investment && (
                              <div className={styles.error}>
                                {errors.investment}
                              </div>
                            )}
                          </>
                        ) : (
                          <input
                            type="text"
                            value={`${formatNumber(project.investment)} ₽`}
                            readOnly
                            className={styles.input}
                            placeholder="Инвестиции"
                          />
                        )}
                      </div>
                    )}
                    {(isEditing || project.equity) && (
                      <div className={styles.field}>
                        <label>Доля:</label>
                        {isEditing ? (
                          <>
                            <input
                              type="number"
                              name="equity"
                              value={editData.equity}
                              onChange={handleInputChange}
                              className={styles.input}
                              placeholder="Доля"
                              required
                            />
                            {errors.equity && (
                              <div className={styles.error}>
                                {errors.equity}
                              </div>
                            )}
                          </>
                        ) : (
                          <input
                            type="text"
                            value={`${project.equity} %`}
                            readOnly
                            className={styles.input}
                            placeholder="Доля"
                          />
                        )}
                      </div>
                    )}
                    {(isEditing || project.investmentType) && (
                      <div className={styles.field}>
                        <label>Тип инвестиций:</label>
                        {isEditing ? (
                          <>
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
                            {errors.investmentType && (
                              <div className={styles.error}>
                                {errors.investmentType}
                              </div>
                            )}
                          </>
                        ) : (
                          <input
                            type="text"
                            value={project.investmentType || ""}
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
                    {(isEditing || project.mentorExperience) && (
                      <div className={styles.field}>
                        <label>Опыт ментора (в мес.):</label>
                        {isEditing ? (
                          <>
                            <input
                              type="text"
                              name="mentorExperience"
                              value={editData.mentorExperience}
                              onChange={handleInputChange}
                              className={styles.input}
                              placeholder="Опыт ментора"
                              required
                            />
                            {errors.mentorExperience && (
                              <div className={styles.error}>
                                {errors.mentorExperience}
                              </div>
                            )}
                          </>
                        ) : (
                          <input
                            type="text"
                            value={`${project.mentorExperience} мес.`}
                            readOnly
                            className={styles.input}
                            placeholder="Опыт ментора"
                          />
                        )}
                      </div>
                    )}
                    {(isEditing || project.mentorSkills) && (
                      <div className={styles.field}>
                        <label>Навыки ментора:</label>
                        {isEditing ? (
                          <>
                            <textarea
                              name="mentorSkills"
                              value={editData.mentorSkills}
                              onChange={handleInputChange}
                              className={styles.input}
                              placeholder="Навыки ментора"
                              required
                            />
                            {errors.mentorSkills && (
                              <div className={styles.error}>
                                {errors.mentorSkills}
                              </div>
                            )}
                          </>
                        ) : (
                          <textarea
                            value={project.mentorSkills || ""}
                            readOnly
                            className={styles.input}
                            placeholder="Навыки ментора"
                          />
                        )}
                      </div>
                    )}
                    {(isEditing || project.mentorWorkFormat) && (
                      <div className={styles.field}>
                        <label>Формат работы:</label>
                        {isEditing ? (
                          <>
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
                            {errors.mentorWorkFormat && (
                              <div className={styles.error}>
                                {errors.mentorWorkFormat}
                              </div>
                            )}
                          </>
                        ) : (
                          <input
                            type="text"
                            value={project.mentorWorkFormat || ""}
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
                  {(isEditing || project.typeOfMentoring) && (
                    <div className={styles.field}>
                      <label>Тип менторства:</label>
                      {isEditing ? (
                        <>
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
                          {errors.typeOfMentoring && (
                            <div className={styles.error}>
                              {errors.typeOfMentoring}
                            </div>
                          )}
                        </>
                      ) : (
                        <input
                          type="text"
                          value={project.typeOfMentoring || ""}
                          readOnly
                          className={styles.input}
                          placeholder="Тип менторства"
                        />
                      )}
                    </div>
                  )}
                  {(isEditing || project.experience) && (
                    <div className={styles.field}>
                      <label>Стаж работы в проекте (в мес.):</label>
                      {isEditing ? (
                        <>
                          <input
                            type="text"
                            name="experience"
                            value={editData.experience}
                            onChange={handleInputChange}
                            className={styles.input}
                            placeholder="Опыт работы"
                            required
                          />
                          {errors.experience && (
                            <div className={styles.error}>
                              {errors.experience}
                            </div>
                          )}
                        </>
                      ) : (
                        <input
                          type="text"
                          value={`${project.experience} мес.`}
                          readOnly
                          className={styles.input}
                          placeholder="Опыт"
                        />
                      )}
                    </div>
                  )}
                  {(isEditing || project.skills) && (
                    <div className={styles.field}>
                      <label>Навыки:</label>
                      {isEditing ? (
                        <>
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
                          {errors.skills && (
                            <div className={styles.error}>{errors.skills}</div>
                          )}
                        </>
                      ) : (
                        <textarea
                          value={project.skills || ""}
                          readOnly
                          className={styles.input}
                          placeholder="Навыки"
                        />
                      )}
                    </div>
                  )}
                </div>
                {(isEditing || project.achievements) && (
                  <div className={styles.field}>
                    <label>Достижения:</label>
                    {isEditing ? (
                      <>
                        <textarea
                          name="achievements"
                          value={editData.achievements}
                          onChange={handleInputChange}
                          className={styles.textarea}
                          placeholder="Достижения"
                          required
                        />
                        {errors.achievements && (
                          <div className={styles.error}>
                            {errors.achievements}
                          </div>
                        )}
                      </>
                    ) : (
                      <textarea
                        value={project.achievements || ""}
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
                  {(isEditing || project.budget) && (
                    <div className={styles.field}>
                      <label>Выделенный бюджет (в руб.):</label>
                      {isEditing ? (
                        <>
                          <input
                            type="text"
                            name="budget"
                            value={editData.budget}
                            onChange={handleInputChange}
                            className={styles.input}
                            placeholder="Бюджет"
                            required
                          />
                          {errors.budget && (
                            <div className={styles.error}>{errors.budget}</div>
                          )}
                        </>
                      ) : (
                        <input
                          type="text"
                          value={`${formatNumber(project.budget)} ₽`}
                          readOnly
                          className={styles.input}
                          placeholder="Бюджет"
                        />
                      )}
                    </div>
                  )}
                </div>
                {(isEditing || project.results) && (
                  <div className={styles.field}>
                    <label>Результаты:</label>
                    {isEditing ? (
                      <>
                        <textarea
                          name="results"
                          value={editData.results}
                          onChange={handleInputChange}
                          className={styles.textarea}
                          placeholder="Результаты"
                          required
                        />
                        {errors.results && (
                          <div className={styles.error}>{errors.results}</div>
                        )}
                      </>
                    ) : (
                      <textarea
                        value={project.results || ""}
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
