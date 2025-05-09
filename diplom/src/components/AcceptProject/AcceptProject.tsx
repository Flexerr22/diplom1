import styles from "./AcceptProject.module.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { Container } from "../Container/Container";
import {
  CreateProjectRequest,
  ProductProps,
} from "../../helpers/projects.props";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { MessageProps } from "../../helpers/message.props";
import { ProgressBar } from "../ProgressBar/ProgressBar";
import Button from "../Button/Button";
import { Rating } from "../Rating/Rating";

interface Step {
  id: number;
  text: string;
  completed: boolean;
}

export type ModalTypeAccept = "rating" | null;
export function AcceptProject() {
  const [project, setProject] = useState<CreateProjectRequest | null>(null);
  const [projectId, setProjectId] = useState<number | null>(null);
  const [steps, setSteps] = useState<Step[]>([]);
  const [newStep, setNewStep] = useState<string>("");
  const [activeModal, setActiveModal] = useState<ModalTypeAccept>(null);
  const [projects, setProjects] = useState<ProductProps[]>([]);
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const role = Cookies.get("role");
    if (role) {
      setUserRole(role);
    }

    if (projectId) {
      const saved = localStorage.getItem(`steps_${projectId}`);
      if (saved) {
        setSteps(JSON.parse(saved));
      } else {
        setSteps([]);
      }
    }
  }, [projectId]);

  // сохранение шагов при каждом изменении
  useEffect(() => {
    if (projectId) {
      localStorage.setItem(`steps_${projectId}`, JSON.stringify(steps));
    }
  }, [steps]);

  useEffect(() => {
    const getProjectById = async () => {
      if (!projectId) return;
      try {
        const response = await axios.get<CreateProjectRequest>(
          `http://127.0.0.1:8000/projects/${projectId}`
        );
        setProject(response.data);
      } catch (error) {
        console.error("Ошибка при загрузке проекта:", error);
      }
    };
    getAcceptedUserProjects();
    getProjectById();
  }, [projectId]);

  const getAcceptedUserProjects = async () => {
    const jwt = Cookies.get("jwt");
    if (!jwt) return;

    try {
      const decoded = jwtDecode<{ sub: string }>(jwt);
      const user_id = parseInt(decoded.sub, 10);

      // 1. Получаем все проекты пользователя
      const userProjectsResponse = await axios.get<ProductProps[]>(
        `http://127.0.0.1:8000/projects/my-projects/${user_id}`
      );
      const allUserProjects = userProjectsResponse.data;

      // 2. Получаем все уведомления пользователя (где он отправитель или получатель)
      const notificationsResponse = await axios.get<MessageProps[]>(
        `http://127.0.0.1:8000/notifications/${user_id}`
      );
      const allNotifications = notificationsResponse.data;

      console.log("Все проекты пользователя:", allUserProjects);
      console.log("Все уведомления пользователя:", allNotifications);

      // 3. Фильтруем только принятые уведомления
      const acceptedNotifications = allNotifications.filter(
        (notification) => notification.status === "accepted"
      );
      
      console.log("Принятые уведомления:", acceptedNotifications);

      // 4. Получаем уникальные ID проектов из принятых уведомлений
      const acceptedProjectIds = [
        ...new Set(
          acceptedNotifications.map((notification) => notification.project_id)
        ),
      ];

      console.log("ID принятых проектов:", acceptedProjectIds);

      // 5. Фильтруем проекты пользователя, которые есть в acceptedProjectIds
      const acceptedProjects = allUserProjects.filter((project) =>
        acceptedProjectIds.includes(project.id)
      );

      console.log("Принятые проекты:", acceptedProjects);

      setProjects(acceptedProjects);

      // 6. Устанавливаем первый проект по умолчанию, если есть проекты
      if (acceptedProjects.length > 0 && !projectId) {
        setProjectId(acceptedProjects[0].id);
      }
    } catch (error) {
      console.error("Ошибка при получении данных:", error);
    }
  };

  const handleAddStep = () => {
    if (newStep.trim()) {
      setSteps([
        ...steps,
        { id: Date.now(), text: newStep.trim(), completed: false },
      ]);
      setNewStep("");
    }
  };

  const handleToggleStep = (id: number) => {
    setSteps(
      steps.map((step) =>
        step.id === id ? { ...step, completed: !step.completed } : step
      )
    );
  };

  const handleDeleteStep = (id: number) => {
    setSteps(steps.filter((step) => step.id !== id));
  };

  const completedCount = steps.filter((step) => step.completed).length;
  const progress = steps.length
    ? Math.round((completedCount / steps.length) * 100)
    : 0;

  if (projects.length === 0) {
    const searchLink = userRole === 'entrepreneur' ? '/mentor' : '/projects'
    return (
      <Container>
        <div className={styles.project_no}>
          <p>Отправьте заявку на сотрудничество для начала работы над совместным проектом</p>
            <a href={searchLink}>
              <Button appearence="small">Начать поиск</Button>
            </a>
        </div>
      </Container>
    );
  }
    
  if (!project) {
    return <div>Загрузка...</div>;
  }

  const handleProjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedProjectId = Number(e.target.value);
    setProjectId(selectedProjectId);
    setProject(null); // Сбрасываем текущий проект перед загрузкой нового
  };

  return (
    <>
      <Container>
        <div className={styles.main}>
          <div className={styles.projectSelect}>
            <label>Выберите проект:</label>
            <select value={projectId || ""} onChange={handleProjectChange}>
              <option value="" disabled>
                Выберите проект
              </option>
              {projects.map((proj) => (
                <option key={proj.id} value={proj.id}>
                  {proj.title}
                </option>
              ))}
            </select>
          </div>
          {projectId && (
            <div className={styles.progress}>
              <p className={styles.progress_title}>Прогресс проекта:</p>
              <div className={styles.stadies}>
                <div>
                  <p>Этапы:</p>
                  <div className={styles.steps}>
                    {steps.map((step) => (
                      <div key={step.id} className={styles.step}>
                        <span
                          className={step.completed ? styles.completed : ""}
                        >
                          {step.text}
                        </span>
                        <button onClick={() => handleToggleStep(step.id)}>
                          {step.completed ? "Отменить" : "Выполнен"}
                        </button>
                        <button onClick={() => handleDeleteStep(step.id)}>
                          Удалить
                        </button>
                      </div>
                    ))}
                    <div className={styles.newStep}>
                      <input
                        type="text"
                        value={newStep}
                        onChange={(e) => setNewStep(e.target.value)}
                        placeholder="Новый этап"
                      />
                      <button onClick={handleAddStep}>Добавить</button>
                    </div>
                  </div>
                </div>
                <ProgressBar progress={progress} />
              </div>
            </div>
          )}
          {projectId && (
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
                          <label>Выручка:</label>
                          <input
                            type="text"
                            value={project.revenue}
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
                        <label>Инвестиции:</label>
                        <input
                          type="text"
                          value={project.investment}
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
                            value={project.equity}
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
                        <label>Опыт ментора:</label>
                        <input
                          type="text"
                          value={project.mentorExperience}
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
                        <label>Опыт:</label>
                        <input
                          type="text"
                          value={project.experience}
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
                        <label>Выделенный бюджет:</label>
                        <input
                          type="text"
                          value={project.budget}
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
              {userRole === "entrepreneur" && (
                <Button
                  className={styles.button_complite}
                  appearence="small"
                  onClick={() =>
                    setActiveModal((prev) =>
                      prev === "rating" ? null : "rating"
                    )
                  }
                >
                  Завершить проект
                </Button>
              )}
              {activeModal === "rating" && (
                <Rating setActiveModal={setActiveModal} />
              )}
            </div>
          )}
        </div>
      </Container>
    </>
  );
}
