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
  const [projectData, setProjectData] = useState<CreateProjectRequest>({
    title: "",
    description: "",
    user_id: 0,
    investment: "",
    stage: "",
    category: "",
    tagline: "",
  });

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
    setProjectData((prevState) => ({ ...prevState, [name]: value }));
  };

  // const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files) {
  //     setSelectedFiles(Array.from(e.target.files));
  //   }
  // };

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   postProject();
  // };

  return (
    <>
      <Header />
      <Container>
        <div className={styles.main}>
          <h2>Создание проекта</h2>
          <form className={styles.form} onSubmit={postProject}>
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
                placeholder="Описание"
                value={projectData.description}
                onChange={handleInputChange}
                required
              />
            </div>

            {role === "entrepreneur" && (
              <>
                <div className={styles.main_details}>
                  <p>Основные детали проекта</p>
                  <textarea
                    name="tagline"
                    placeholder="Краткое описание (до 200 символов)"
                    value={projectData.tagline}
                    onChange={handleInputChange}
                  />
                  <div className={styles.inputs}>
                    <input
                      type="text"
                      name="category"
                      placeholder="Категория/Специализация"
                      value={projectData.category}
                      onChange={handleInputChange}
                    />
                    <input
                      type="text"
                      name="stage"
                      placeholder="Стадия проекта"
                      value={projectData.stage}
                      onChange={handleInputChange}
                    />
                    <input
                      type="text"
                      name="links"
                      placeholder="Ссылки"
                      value={projectData.links}
                      onChange={handleInputChange}
                    />
                    <input
                      type="text"
                      name="revenue"
                      placeholder="Выручка"
                      value={projectData.revenue}
                      onChange={handleInputChange}
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
                    />
                    <input
                      type="text"
                      name="equity"
                      placeholder="Доля в проекте"
                      value={projectData.equity}
                      onChange={handleInputChange}
                    />
                    <input
                      type="text"
                      name="investmentType"
                      placeholder="Тип инвестиций"
                      value={projectData.investmentType}
                      onChange={handleInputChange}
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
                    />
                    <input
                      type="text"
                      name="mentorSkills"
                      placeholder="Навыки наставника"
                      value={projectData.mentorSkills}
                      onChange={handleInputChange}
                    />
                    <input
                      type="text"
                      name="mentorWorkFormat"
                      placeholder="Формат работы с наставником"
                      value={projectData.mentorWorkFormat}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="">
                  <p>Допольнительные детали проекта</p>
                  <div className={styles.textareas}>
                    <textarea
                      name="team"
                      placeholder="Команда"
                      value={projectData.team}
                      onChange={handleInputChange}
                    />
                    <textarea
                      name="goals"
                      placeholder="Цели"
                      value={projectData.goals}
                      onChange={handleInputChange}
                    />
                    <textarea
                      name="problem"
                      placeholder="Проблема"
                      value={projectData.problem}
                      onChange={handleInputChange}
                    />
                    <textarea
                      name="solution"
                      placeholder="Решение"
                      value={projectData.solution}
                      onChange={handleInputChange}
                    />
                    <textarea
                      name="targetAudience"
                      placeholder="Целевая аудитория"
                      value={projectData.targetAudience}
                      onChange={handleInputChange}
                    />
                    <textarea
                      name="risks"
                      placeholder="Риски"
                      value={projectData.risks}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                {/* <div className={styles.uploadSection}>
                  <label>Прикрепить файлы</label>
                  <input type="file" multiple onChange={handleImageChange} />
                  {selectedFiles.map((file) => (
                    <p key={file.name}>{file.name}</p>
                  ))}
                </div> */}
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
                  />
                  <input
                    type="text"
                    name="experience"
                    placeholder="Опыт работы"
                    value={projectData.experience}
                    onChange={handleInputChange}
                  />
                  <input
                    type="text"
                    name="role"
                    placeholder="Роль в проекте"
                    value={projectData.role}
                    onChange={handleInputChange}
                  />
                  <input
                    type="text"
                    name="skills"
                    placeholder="Навыки"
                    value={projectData.skills}
                    onChange={handleInputChange}
                  />
                </div>
                <textarea
                  name="achievements"
                  placeholder="Достижения"
                  value={projectData.achievements}
                  onChange={handleInputChange}
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
                  />

                  <input
                    type="text"
                    name="budget"
                    placeholder="Бюджет"
                    value={projectData.budget}
                    onChange={handleInputChange}
                  />
                  <input
                    type="text"
                    name="role"
                    placeholder="Роль в проекте"
                    value={projectData.role}
                    onChange={handleInputChange}
                  />
                </div>
                <textarea
                  name="results"
                  placeholder="Результаты"
                  value={projectData.results}
                  onChange={handleInputChange}
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
