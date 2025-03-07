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
  // const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
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

  const validateInput = (value: string): boolean => {
    // Проверка на специальные символы
    const regex = /^[a-zA-Zа-яА-Я0-9\s.,:%!?()@_-]*$/;
    if (!regex.test(value)) {
      setError(
        "Недопустимые символы. Разрешены только буквы, цифры, пробелы и @_."
      );
      return false;
    }

    // Проверка на несколько пробелов подряд
    if (/\s{2,}/.test(value)) {
      setError("Нельзя вводить более одного пробела подряд.");
      return false;
    }

    setError(null); // Очищаем ошибку, если ввод корректен
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
    const responce = await axios.post<CreateProjectRequest>(
      "http://127.0.0.1:8000/projects/create-project",
      { ...projectData, user_id, role }
    );
    setProjectData((prev) => ({
      ...prev,
      ...responce.data,
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
                    <input
                      type="text"
                      name="category"
                      placeholder="Категория/Специализация"
                      value={projectData.category}
                      onChange={handleInputChange}
                      required
                    />
                    <input
                      type="text"
                      name="stage"
                      placeholder="Стадия проекта"
                      value={projectData.stage}
                      onChange={handleInputChange}
                      required
                    />
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
                    />
                    <input
                      type="text"
                      name="equity"
                      placeholder="Доля в проекте"
                      value={projectData.equity}
                      onChange={handleInputChange}
                      required
                    />
                    <input
                      type="text"
                      name="investmentType"
                      placeholder="Тип инвестиций"
                      value={projectData.investmentType}
                      onChange={handleInputChange}
                      required
                    />
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
                    />
                    <input
                      type="text"
                      name="mentorSkills"
                      placeholder="Навыки наставника"
                      value={projectData.mentorSkills}
                      onChange={handleInputChange}
                      required
                    />
                    <input
                      type="text"
                      name="mentorWorkFormat"
                      placeholder="Формат работы с наставником"
                      value={projectData.mentorWorkFormat}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="">
                  <p>Допольнительные детали проекта</p>
                  <div className={styles.textareas}>
                    <textarea
                      name="team"
                      placeholder="Команда (максимум 255 символов)"
                      value={projectData.team}
                      onChange={handleInputChange}
                      maxLength={255}
                    />
                    <textarea
                      name="goals"
                      placeholder="Цели (максимум 255 символов)"
                      value={projectData.goals}
                      onChange={handleInputChange}
                      maxLength={255}
                    />
                    <textarea
                      name="problem"
                      placeholder="Проблема (максимум 255 символов)"
                      value={projectData.problem}
                      onChange={handleInputChange}
                      maxLength={255}
                    />
                    <textarea
                      name="solution"
                      placeholder="Решение (максимум 255 символов)"
                      value={projectData.solution}
                      onChange={handleInputChange}
                      maxLength={255}
                    />
                    <textarea
                      name="targetAudience"
                      placeholder="Целевая аудитория (максимум 255 символов)"
                      value={projectData.targetAudience}
                      onChange={handleInputChange}
                      maxLength={255}
                    />
                    <textarea
                      name="risks"
                      placeholder="Риски (максимум 255 символов)"
                      value={projectData.risks}
                      onChange={handleInputChange}
                      maxLength={255}
                    />
                  </div>
                </div>
              </>
            )}

            {role === "mentor" && (
              <>
                <p>Информация о наставнике в проекте</p>
                <div className={styles.inputs}>
                  <input
                    type="text"
                    name="typeOfMentoring"
                    placeholder="Вид наставничества"
                    value={projectData.typeOfMentoring}
                    onChange={handleInputChange}
                    required
                  />
                  <input
                    type="text"
                    name="experience"
                    placeholder="Опыт работы"
                    value={projectData.experience}
                    onChange={handleInputChange}
                    required
                  />
                  <input
                    type="text"
                    name="role"
                    placeholder="Роль в проекте"
                    value={projectData.role}
                    onChange={handleInputChange}
                    required
                  />
                  <input
                    type="text"
                    name="skills"
                    placeholder="Навыки"
                    value={projectData.skills}
                    onChange={handleInputChange}
                    required
                  />
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
                  <input
                    type="text"
                    name="typeOfInvestment"
                    placeholder="Тип инвестиций"
                    value={projectData.typeOfInvestment}
                    onChange={handleInputChange}
                    required
                  />

                  <input
                    type="text"
                    name="budget"
                    placeholder="Бюджет"
                    value={projectData.budget}
                    onChange={handleInputChange}
                    required
                  />
                  <input
                    type="text"
                    name="role"
                    placeholder="Роль в проекте"
                    value={projectData.role}
                    onChange={handleInputChange}
                    required
                  />
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
