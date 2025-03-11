import { useEffect, useState } from "react";
import Button from "../../components/Button/Button";
import { Container } from "../../components/Container/Container";
import { Footer } from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import styles from "./CreateProject.module.css";
import Cookies from "js-cookie";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

interface CreateProjectRequest {
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
  user_id: number;
}

export function CreateProject() {
  const [role, setRole] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [projectData, setProjectData] = useState<CreateProjectRequest>({
    title: "",
    description: "",
    user_id: 0,
    investment: "",
    stage: "",
    category: "",
    tagline: "",
  });

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

  const roles = [
    "Основатель",
    "Инвестор",
    "Наставник",
    "Разработчик",
    "Маркетолог",
  ];

  const skillsList = [
    "Программирование",
    "Дизайн",
    "Аналитика данных",
    "Управление проектами",
    "Маркетинг",
  ];

  const validateInput = (value: string): boolean => {
    const regex = /^[a-zA-Zа-яА-Я0-9\s.,:%!?()@_-]*$/;
    if (!regex.test(value)) {
      setError(
        "Недопустимые символы. Разрешены только буквы, цифры, пробелы и @_."
      );
      return false;
    }

    if (/\s{2,}/.test(value)) {
      setError("Нельзя вводить более одного пробела подряд.");
      return false;
    }

    setError(null);
    return true;
  };

  const postProject = async () => {
    const jwt = Cookies.get("jwt");
    const role = Cookies.get("role");
    if (!jwt) {
      console.error("JWT-токен отсутствует");
      return;
    }

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
  };

  useEffect(() => {
    const role = Cookies.get("role");

    if (role) {
      setRole(role);
    }
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    if (!validateInput(value)) {
      return;
    }

    const trimmedValue = value.replace(/\s+/g, " ");

    setProjectData((prevState) => ({ ...prevState, [name]: trimmedValue }));
  };

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
              <input
                type="text"
                name="title"
                placeholder="Название проекта"
                value={projectData.title}
                onChange={handleInputChange}
                required
                maxLength={30}
              />
              <textarea
                name="description"
                placeholder="Описание (максимум 255 символов)"
                value={projectData.description}
                onChange={handleInputChange}
                required
                maxLength={255}
              />
            </div>

            {role === "entrepreneur" && (
              <>
                <div className={styles.main_details}>
                  <p>Основные детали проекта</p>
                  <textarea
                    name="tagline"
                    placeholder="Краткое описание (до 255 символов)"
                    value={projectData.tagline}
                    onChange={handleInputChange}
                    maxLength={255}
                    required
                  />
                  <div className={styles.inputs}>
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

                    <input
                      type="text"
                      name="links"
                      placeholder="Ссылки"
                      value={projectData.links}
                      onChange={handleInputChange}
                      required
                    />
                    <input
                      type="text"
                      name="revenue"
                      placeholder="Выручка"
                      value={projectData.revenue}
                      onChange={handleInputChange}
                      required
                      maxLength={30}
                    />
                  </div>
                </div>

                <div>
                  <p>Для инвесторов</p>
                  <div className={styles.inputs}>
                    <input
                      type="text"
                      name="investment"
                      placeholder="Требуемые инвестиции"
                      value={projectData.investment}
                      onChange={handleInputChange}
                      required
                      maxLength={30}
                    />
                    <input
                      type="text"
                      name="equity"
                      placeholder="Доля в проекте в %"
                      value={projectData.equity}
                      onChange={handleInputChange}
                      required
                      maxLength={15}
                    />
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
                  </div>
                </div>

                <div>
                  <p>Ожидания от наставника</p>
                  <div className={styles.inputs}>
                    <input
                      type="text"
                      name="mentorExperience"
                      placeholder="Опыт работы наставника"
                      value={projectData.mentorExperience}
                      onChange={handleInputChange}
                      required
                      maxLength={25}
                    />
                    <input
                      type="text"
                      name="mentorSkills"
                      placeholder="Навыки наставника"
                      value={projectData.mentorSkills}
                      onChange={handleInputChange}
                      required
                      maxLength={30}
                    />
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
                  </div>
                </div>
              </>
            )}

            {role === "mentor" && (
              <>
                <p>Информация о наставнике в проекте</p>
                <div className={styles.inputs}>
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

                  <input
                    type="text"
                    name="experience"
                    placeholder="Опыт работы"
                    value={projectData.experience}
                    onChange={handleInputChange}
                    required
                  />

                  <select
                    name="role"
                    value={projectData.role}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="" disabled>
                      Выберите роль
                    </option>
                    {roles.map((role, index) => (
                      <option key={index} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>

                  <select
                    name="skills"
                    value={projectData.skills}
                    onChange={handleInputChange}
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
                </div>
                <textarea
                  name="achievements"
                  placeholder="Достижения (максимум 255 символов)"
                  value={projectData.achievements}
                  onChange={handleInputChange}
                  maxLength={255}
                  required
                />
              </>
            )}

            {role === "investor" && (
              <>
                <p>Информация об инвесторе в проекте</p>
                <div className={styles.inputs}>
                  <select
                    name="typeOfInvestment"
                    value={projectData.typeOfInvestment}
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

                  <input
                    type="text"
                    name="budget"
                    placeholder="Бюджет"
                    value={projectData.budget}
                    onChange={handleInputChange}
                    required
                  />

                  <select
                    name="role"
                    value={projectData.role}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="" disabled>
                      Выберите роль
                    </option>
                    {roles.map((role, index) => (
                      <option key={index} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </div>
                <textarea
                  name="results"
                  placeholder="Результаты (максимум 255 символов)"
                  value={projectData.results}
                  onChange={handleInputChange}
                  maxLength={255}
                  required
                />
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
