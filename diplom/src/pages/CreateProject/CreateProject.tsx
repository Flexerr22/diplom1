import { useEffect, useState } from "react";
import Button from "../../components/Button/Button";
import { Container } from "../../components/Container/Container";
import { Footer } from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import styles from "./CreateProject.module.css";
import Cookies from "js-cookie";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { CreateProjectRequest } from "../../types/projects.props";
import { Modal } from "../../components/Modal/Modal";

export function CreateProject() {
  const [role, setRole] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isAuthtozise, setIsAuthtorize] = useState(false);
  const [projectData, setProjectData] = useState<CreateProjectRequest>({
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

  const [errors, setErrors] = useState<Record<string, string>>({});

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

  useEffect(() => {
    const jwt = Cookies.get("jwt");
    setIsAuthtorize(!!jwt);
  }, []);

  // Функция для валидации пробелов
  const validateSpaces = (value: string): string => {
    return value.replace(/\s{2,}/g, " ");
  };

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

  const postProject = async () => {
    if (!validateForm()) {
      return;
    }

    const jwt = Cookies.get("jwt");
    if (!jwt) {
      console.error("JWT-токен отсутствует");
      return;
    }

    try {
      const decoded = jwtDecode<{ sub: string }>(jwt);
      const user_id = decoded.sub;
      const response = await axios.post<CreateProjectRequest>(
        "http://127.0.0.1:8000/projects/create-project",
        { ...projectData, user_id, role }
      );
      setProjectData((prev) => ({
        ...prev,
        ...response.data,
      }));
      // Очистка формы или перенаправление после успешного создания
    } catch (error) {
      console.error("Ошибка при создании проекта:", error);
      setError("Не удалось создать проект. Пожалуйста, попробуйте снова.");
    }
  };

  useEffect(() => {
    const role = Cookies.get("role");
    if (role) {
      setRole(role);
    }
  }, []);

  const validateInput = (value: string, fieldName: string): boolean => {
    // Для поля links разрешаем все символы
    if (fieldName === "links") {
      return true;
    }

    // Разрешаем буквы, цифры, пробелы и основные знаки препинания
    const regex = /^[a-zA-Zа-яА-ЯёЁ0-9\s.,!?()%:-]*$/;
    return regex.test(value);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    // Общие обязательные поля для всех ролей
    if (!projectData.title.trim()) {
      newErrors.title = "Название обязательно";
      isValid = false;
    }
    if (!projectData.description.trim()) {
      newErrors.description = "Описание обязательно";
      isValid = false;
    }

    // Валидация для предпринимателя
    if (role === "entrepreneur") {
      if (!projectData.tagline?.trim()) {
        newErrors.tagline = "Краткое описание обязательно";
        isValid = false;
      }
      if (!projectData.category) {
        newErrors.category = "Категория обязательна";
        isValid = false;
      }
      if (!projectData.stage) {
        newErrors.stage = "Стадия обязательна";
        isValid = false;
      }

      // Валидация числовых полей
      const numberFields = [
        { name: "investment", min: 0, max: Infinity },
        { name: "equity", min: 0, max: 100 },
        { name: "revenue", min: 0, max: Infinity },
        { name: "mentorExperience", min: 0, max: Infinity },
      ];

      numberFields.forEach((field) => {
        const value = projectData[field.name as keyof CreateProjectRequest];
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

      if (!projectData.investmentType) {
        newErrors.investmentType = "Тип инвестиций обязателен";
        isValid = false;
      }
      if (!projectData.mentorSkills?.trim()) {
        newErrors.mentorSkills = "Навыки ментора обязательны";
        isValid = false;
      }
      if (!projectData.mentorWorkFormat) {
        newErrors.mentorWorkFormat = "Формат работы обязателен";
        isValid = false;
      }
    }

    // Валидация для наставника
    if (role === "mentor") {
      if (!projectData.typeOfMentoring) {
        newErrors.typeOfMentoring = "Тип менторства обязателен";
        isValid = false;
      }
      if (!projectData.experience) {
        newErrors.experience = "Опыт обязателен";
        isValid = false;
      } else {
        const error = validateNumber(
          projectData.experience.toString(),
          "experience",
          0
        );
        if (error) {
          newErrors.experience = error;
          isValid = false;
        }
      }
      if (!projectData.skills) {
        newErrors.skills = "Навыки обязательны";
        isValid = false;
      }
      if (!projectData.achievements?.trim()) {
        newErrors.achievements = "Достижения обязательны";
        isValid = false;
      }
    }

    // Валидация для инвестора
    if (role === "investor") {
      if (!projectData.budget) {
        newErrors.budget = "Бюджет обязателен";
        isValid = false;
      } else {
        const error = validateNumber(
          projectData.budget.toString(),
          "budget",
          0
        );
        if (error) {
          newErrors.budget = error;
          isValid = false;
        }
      }
      if (!projectData.results?.trim()) {
        newErrors.results = "Результаты обязательны";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    // Проверяем на допустимые символы
    if (!validateInput(value, name)) {
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

    setProjectData((prev) => ({
      ...prev,
      [name as keyof CreateProjectRequest]: validatedValue,
    }));
  };

  if (!isAuthtozise) {
    return (
      <>
        <Header />
        <Container>
          <div className={styles.auth}>
            <b>
              Вы еще неавторизованы в системе. Пожалуйста авторизуйтесь чтобы
              создать проект
            </b>
            <Button
              appearence="big"
              className={styles["button_register_info"]}
              onClick={() => setModalOpen(true)}
            >
              Зарегистрироваться
            </Button>
          </div>
          {modalOpen && (
            <div className={styles["modal_main"]}>
              <div className={styles["modal_secondary"]}>
                <button
                  onClick={() => setModalOpen(false)}
                  className={styles["close"]}
                >
                  ✖
                </button>
                <Modal
                  closeModal={() => setModalOpen(false)}
                  setIsAuth={(value) => {
                    setIsAuthtorize(value);
                    setModalOpen(false);
                  }}
                />
              </div>
            </div>
          )}
        </Container>
      </>
    );
  }

  return (
    <>
      <Header />
      <Container>
        <div className={styles.main}>
          {error && <div className={styles.error}>{error}</div>}
          <form className={styles.form} onSubmit={postProject}>
            <h2>Создание проекта</h2>
            <div className={styles.main_info}>
              <p>Основная информация</p>
              <div className={styles.field}>
                <input
                  type="text"
                  name="title"
                  placeholder="Название проекта"
                  value={projectData.title}
                  onChange={handleInputChange}
                  required
                  maxLength={30}
                />
                {errors.title && (
                  <div className={styles.error}>{errors.title}</div>
                )}
              </div>
              <div className={styles.field}>
                <textarea
                  name="description"
                  placeholder="Описание (максимум 255 символов)"
                  value={projectData.description}
                  onChange={handleInputChange}
                  required
                  maxLength={255}
                />
                {errors.description && (
                  <div className={styles.error}>{errors.description}</div>
                )}
              </div>
            </div>

            {role === "entrepreneur" && (
              <>
                <div className={styles.main_details}>
                  <p>Основные детали проекта</p>
                  <div className={styles.field}>
                    <textarea
                      name="tagline"
                      placeholder="Краткое описание (до 255 символов)"
                      value={projectData.tagline}
                      onChange={handleInputChange}
                      maxLength={255}
                      required
                    />
                    {errors.tagline && (
                      <div className={styles.error}>{errors.tagline}</div>
                    )}
                  </div>
                  <div className={styles.inputs}>
                    <div className={styles.field}>
                      <select
                        name="category"
                        value={projectData.category}
                        onChange={handleInputChange}
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
                        <div className={styles.error}>{errors.category}</div>
                      )}
                    </div>

                    <div className={styles.field}>
                      <select
                        name="stage"
                        value={projectData.stage}
                        onChange={handleInputChange}
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
                    </div>

                    <div className={styles.field}>
                      <input
                        type="text"
                        name="links"
                        placeholder="Ссылки"
                        value={projectData.links}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className={styles.field}>
                      <input
                        type="number"
                        name="revenue"
                        placeholder="Выручка ( в руб. )"
                        value={projectData.revenue}
                        onChange={handleInputChange}
                        required
                        maxLength={30}
                      />
                      {errors.revenue && (
                        <div className={styles.error}>{errors.revenue}</div>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <p>Для инвесторов</p>
                  <div className={styles.inputs}>
                    <div className={styles.field}>
                      <input
                        type="number"
                        name="investment"
                        placeholder="Требуемые инвестиции ( в руб. )"
                        value={projectData.investment}
                        onChange={handleInputChange}
                        required
                        maxLength={30}
                      />
                      {errors.investment && (
                        <div className={styles.error}>{errors.investment}</div>
                      )}
                    </div>

                    <div className={styles.field}>
                      <input
                        type="number"
                        name="equity"
                        placeholder="Доля в проекте в %"
                        value={projectData.equity}
                        onChange={handleInputChange}
                        required
                        maxLength={15}
                      />
                      {errors.equity && (
                        <div className={styles.error}>{errors.equity}</div>
                      )}
                    </div>

                    <div className={styles.field}>
                      <select
                        name="investmentType"
                        value={projectData.investmentType}
                        onChange={handleInputChange}
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
                    </div>
                  </div>
                </div>

                <div>
                  <p>Ожидания от наставника</p>
                  <div className={styles.inputs}>
                    <div className={styles.field}>
                      <input
                        type="number"
                        name="mentorExperience"
                        placeholder="Опыт работы наставника ( в мес. )"
                        value={projectData.mentorExperience}
                        onChange={handleInputChange}
                        required
                        maxLength={25}
                      />
                      {errors.mentorExperience && (
                        <div className={styles.error}>
                          {errors.mentorExperience}
                        </div>
                      )}
                    </div>

                    <div className={styles.field}>
                      <textarea
                        name="mentorSkills"
                        placeholder="Навыки наставника"
                        value={projectData.mentorSkills}
                        onChange={handleInputChange}
                        required
                        maxLength={100}
                      />
                      {errors.mentorSkills && (
                        <div className={styles.error}>
                          {errors.mentorSkills}
                        </div>
                      )}
                    </div>

                    <div className={styles.field}>
                      <select
                        name="mentorWorkFormat"
                        value={projectData.mentorWorkFormat}
                        onChange={handleInputChange}
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
                    </div>
                  </div>
                </div>
              </>
            )}

            {role === "mentor" && (
              <>
                <p>Информация о наставнике в проекте</p>
                <div className={styles.inputs}>
                  <div className={styles.field}>
                    <select
                      name="typeOfMentoring"
                      value={projectData.typeOfMentoring}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="" disabled>
                        Выберите вид наставничества
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
                  </div>

                  <div className={styles.field}>
                    <input
                      type="number"
                      name="experience"
                      placeholder="Стаж работы в проекте (в мес.)"
                      value={projectData.experience}
                      onChange={handleInputChange}
                      required
                    />
                    {errors.experience && (
                      <div className={styles.error}>{errors.experience}</div>
                    )}
                  </div>

                  <div className={styles.field}>
                    <input
                      type="text"
                      name="skills"
                      placeholder="Навыки"
                      value={projectData.skills}
                      onChange={handleInputChange}
                      required
                    />
                    {errors.skills && (
                      <div className={styles.error}>{errors.skills}</div>
                    )}
                  </div>
                </div>

                <div className={styles.field}>
                  <textarea
                    name="achievements"
                    placeholder="Достижения (максимум 255 символов)"
                    value={projectData.achievements}
                    onChange={handleInputChange}
                    maxLength={255}
                    required
                  />
                  {errors.achievements && (
                    <div className={styles.error}>{errors.achievements}</div>
                  )}
                </div>
              </>
            )}

            {role === "investor" && (
              <>
                <p>Информация об инвесторе в проекте</p>
                <div className={styles.inputs}>
                  <div className={styles.field}>
                    <input
                      type="number"
                      name="budget"
                      placeholder="Размер инвестиций (в руб.)"
                      value={projectData.budget}
                      onChange={handleInputChange}
                      required
                    />
                    {errors.budget && (
                      <div className={styles.error}>{errors.budget}</div>
                    )}
                  </div>
                </div>

                <div className={styles.field}>
                  <textarea
                    name="results"
                    placeholder="Результаты (максимум 255 символов)"
                    value={projectData.results}
                    onChange={handleInputChange}
                    maxLength={255}
                    required
                  />
                  {errors.results && (
                    <div className={styles.error}>{errors.results}</div>
                  )}
                </div>
              </>
            )}

            <Button
              type="submit"
              appearence="small"
              className={styles.button_form}
            >
              Сохранить
            </Button>
          </form>
        </div>
      </Container>
      <Footer />
    </>
  );
}
