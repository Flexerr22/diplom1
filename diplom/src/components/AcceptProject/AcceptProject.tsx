import styles from "./AcceptProject.module.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { Container } from "../Container/Container";
import { CreateProjectRequest, ProductProps } from "../../types/projects.props";
import Cookies from "js-cookie";
import { ProgressBar } from "../ProgressBar/ProgressBar";
import Button from "../Button/Button";
import { Rating } from "../Rating/Rating";
import { jwtDecode } from "jwt-decode";
import { ProfileInfo } from "../../types/user.props";
import { StepsProps } from "../../types/steps.props";
import { Footer } from "../Footer/Footer";

interface ProjectUser {
  id: number;
  name: string;
}

export type ModalTypeAccept = "rating" | null;
export function AcceptProject() {
  const [project, setProject] = useState<CreateProjectRequest | null>(null);
  const [projectId, setProjectId] = useState<number | null>(null);
  const [steps, setSteps] = useState<StepsProps[]>([]);
  const [newStep, setNewStep] = useState<string>("");
  const [activeModal, setActiveModal] = useState<ModalTypeAccept>(null);
  const [projects, setProjects] = useState<ProductProps[]>([]);
  const [userRole, setUserRole] = useState("");
  const [users, setUsers] = useState<ProjectUser[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  const formatNumber = (value: number | string): string => {
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
      setUserRole(role);
    }
    getProjectMembers();
  }, []);

  useEffect(() => {
    if (projectId) {
      getProjectUsers();
    }
  }, [projectId]);

  useEffect(() => {
    if (projectId && selectedUserId) {
      getSteps();
    }
  }, [projectId, selectedUserId]);

  const getProjectById = async (id: number) => {
    try {
      const response = await axios.get<CreateProjectRequest>(
        `http://127.0.0.1:8000/projects/${id}`
      );
      setProject(response.data);
    } catch (error) {
      console.error("Ошибка при загрузке проекта:", error);
    }
  };

  const getProjectMembers = async () => {
    const jwt = Cookies.get("jwt");
    if (!jwt) return;

    try {
      const decoded = jwtDecode<{ sub: string }>(jwt);
      const user_id = parseInt(decoded.sub, 10);

      const membersResponse = await axios.get<number[]>(
        `http://127.0.0.1:8000/project-members/my-projects/${user_id}`
      );

      if (membersResponse.data?.length > 0) {
        const projectsPromises = membersResponse.data.map((id) =>
          axios.get<ProductProps>(`http://127.0.0.1:8000/projects/${id}`)
        );

        const projectsResponses = await Promise.all(projectsPromises);
        const projectsData = projectsResponses.map((res) => res.data);

        setProjects(projectsData);

        if (projectsData.length > 0) {
          const firstProjectId = projectsData[0].id;
          setProjectId(firstProjectId);
          getProjectById(firstProjectId);
        }
      }
    } catch (error) {
      console.error("Ошибка при загрузке проектов:", error);
    }
  };

  const getProjectUsers = async () => {
    if (!projectId) return;
    const jwt = Cookies.get("jwt");
    if (!jwt) return;

    try {
      const decoded = jwtDecode<{ sub: string }>(jwt);
      const user_id = parseInt(decoded.sub, 10);
      const response = await axios.get<number[]>(
        `http://127.0.0.1:8000/project-members/${projectId}/users/${user_id}`
      );

      const usersPromises = response.data.map((id) =>
        axios.get<ProfileInfo>(`http://127.0.0.1:8000/users/${id}`)
      );

      const usersResponses = await Promise.all(usersPromises);
      const usersData = usersResponses.map((res) => ({
        id: res.data.id,
        name: res.data.name,
      }));

      setUsers(usersData);

      // Устанавливаем первого пользователя как выбранного по умолчанию
      if (usersData.length > 0) {
        setSelectedUserId(usersData[0].id ?? null);
      }
    } catch (error) {
      console.error("Ошибка при загрузке пользователей проекта:", error);
    }
  };

  const handleProjectChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedProjectId = Number(e.target.value);
    setProjectId(selectedProjectId);
    await getProjectById(selectedProjectId);
  };

  const getSteps = async () => {
    const jwt = Cookies.get("jwt");
    if (!jwt || !projectId || !selectedUserId) return;

    try {
      const decoded = jwtDecode<{ sub: string }>(jwt);
      const user_id = parseInt(decoded.sub, 10);

      // Запрос 1: где текущий пользователь - отправитель
      const stepsAsSender = await axios.get<StepsProps[]>(
        `http://127.0.0.1:8000/project-steps/project/${projectId}/users/${user_id}/${selectedUserId}`
      );

      // Запрос 2: где текущий пользователь - получатель
      const stepsAsRecipient = await axios.get<StepsProps[]>(
        `http://127.0.0.1:8000/project-steps/project/${projectId}/users/${selectedUserId}/${user_id}`
      );

      // Объединяем результаты
      const allSteps = [...stepsAsSender.data, ...stepsAsRecipient.data];
      setSteps(allSteps);
    } catch (error) {
      console.error(error);
    }
  };

  const validateInput = (value: string): boolean => {
    // Проверка на недопустимые символы
    const regex = /^[a-zA-Zа-яА-Я0-9\s.,:%!?()@_-]*$/;
    if (!regex.test(value)) {
      alert(
        "Недопустимые символы. Разрешены только буквы, цифры, пробелы и .,:%!?()@_-"
      );
      return false;
    }

    // Проверка на множественные пробелы
    if (/\s{2,}/.test(value)) {
      alert("Нельзя вводить более одного пробела подряд.");
      return false;
    }

    // Проверка, что есть хотя бы один не-пробельный символ
    if (/^\s*$/.test(value) && value !== "") {
      alert("Введите хотя бы один символ (не пробел)");
      return false;
    }

    // Проверка минимальной длины
    if (value.trim().length < 3) {
      alert("Название этапа должно содержать минимум 3 символа");
      return false;
    }

    // Проверка максимальной длины
    if (value.length > 100) {
      alert("Название этапа не должно превышать 100 символов");
      return false;
    }

    return true;
  };

  const postSteps = async () => {
    const jwt = Cookies.get("jwt");
    if (!jwt) return;

    // Валидация ввода
    if (!newStep.trim()) {
      alert("Поле не может быть пустым");
      return;
    }

    if (!validateInput(newStep)) {
      return;
    }

    try {
      const decoded = jwtDecode<{ sub: string }>(jwt);
      const user_id = parseInt(decoded.sub, 10);

      const Steps = {
        sender_id: user_id,
        recipient_id: selectedUserId,
        project_id: projectId,
        status: "rejected",
        step: newStep.trim(), // Удаляем лишние пробелы
      };

      await axios.post("http://127.0.0.1:8000/project-steps/add-step", Steps);
      setNewStep(""); // Очищаем поле ввода
      await getSteps(); // Обновляем список шагов
    } catch (error) {
      console.error(error);
      alert("Произошла ошибка при добавлении этапа");
    }
  };

  const updateSteps = async (id: number) => {
    try {
      // Находим шаг в текущем состоянии
      const stepToUpdate = steps.find((step) => step.id === id);
      if (!stepToUpdate) return;

      // Определяем новый статус (противоположный текущему)
      const newStatus =
        stepToUpdate.status === "accepted" ? "rejected" : "accepted";

      const update = {
        status: newStatus,
      };

      await axios.put(
        `http://127.0.0.1:8000/project-steps/update-step/${id}`,
        update
      );
      await getSteps(); // Обновляем список шагов
    } catch (error) {
      console.error(error);
    }
  };

  const deleteSteps = async (id: number) => {
    try {
      await axios.delete(
        `http://127.0.0.1:8000/project-steps/delete-step/${id}`
      );
      await getSteps(); // Обновляем список шагов
    } catch (error) {
      console.error(error);
    }
  };

  const deleteAllSteps = async () => {
    const jwt = Cookies.get("jwt");
    if (!jwt || !projectId || !selectedUserId) return;

    try {
      const decoded = jwtDecode<{ sub: string }>(jwt);
      const user_id = parseInt(decoded.sub, 10);

      // Удаляем шаги в обоих направлениях
      await Promise.all([
        axios.delete(
          `http://127.0.0.1:8000/project-steps/project/${projectId}/users/${user_id}/${selectedUserId}`,
          { headers: { Authorization: `Bearer ${jwt}` } }
        ),
        axios.delete(
          `http://127.0.0.1:8000/project-steps/project/${projectId}/users/${selectedUserId}/${user_id}`,
          { headers: { Authorization: `Bearer ${jwt}` } }
        ),
      ]);

      // Обновляем список шагов после удаления
      await getSteps();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        console.log("Шагов для удаления не найдено");
        return;
      }
      console.error("Ошибка при удалении шагов:", error);
    }
  };

  const completedCount = steps.filter(
    (step) => step.status === "accepted"
  ).length;
  const progress = steps.length
    ? Math.round((completedCount / steps.length) * 100)
    : 0;

  if (!projects || projects.length === 0) {
    const searchLink = userRole === "entrepreneur" ? "/mentor" : "/projects";
    return (
      <Container>
        <div className={styles.project_no}>
          <p>
            Отправьте заявку на сотрудничество для начала работы над совместным
            проектом
          </p>
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

  return (
    <>
      <Container>
        <div className={styles.main}>
          <div className={styles.user_project}>
            <div className={styles.projectSelect}>
              <label>Выберите проект:</label>
              <select value={projectId || ""} onChange={handleProjectChange}>
                {projects.map((proj) => (
                  <option key={proj.id} value={proj.id}>
                    {proj.title}
                  </option>
                ))}
              </select>
            </div>

            {users.length > 0 && (
              <div className={styles.projectSelect}>
                <label>Выберите участника:</label>
                <select
                  value={selectedUserId || ""}
                  onChange={(e) => setSelectedUserId(Number(e.target.value))}
                >
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name || `Пользователь ${user.id}`}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
          {projectId && (
            <div className={styles.progress}>
              <p className={styles.progress_title}>Прогресс проекта:</p>
              <div className={styles.stadies}>
                <div>
                  <p>Этапы:</p>
                  <div className={styles.steps}>
                    {steps.map((step, index) => (
                      <div key={index} className={styles.step}>
                        <textarea
                          className={
                            step.status === "accepted" ? styles.completed : ""
                          }
                          maxLength={100}
                        >
                          {step.step}
                        </textarea>
                        <button onClick={() => updateSteps(step.id)}>
                          {step.status === "accepted" ? "Отменить" : "Выполнен"}
                        </button>
                        <button onClick={() => deleteSteps(step.id)}>
                          Удалить
                        </button>
                      </div>
                    ))}
                    <div className={styles.newStep}>
                      <textarea
                        value={newStep}
                        onChange={(e) => setNewStep(e.target.value)}
                        placeholder="Новый этап"
                      />
                      <button onClick={postSteps}>Добавить</button>
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
                <Rating
                  setActiveModal={setActiveModal}
                  sender={selectedUserId}
                  project_id={projectId}
                  deleteAllSteps={deleteAllSteps}
                />
              )}
            </div>
          )}
        </div>
      </Container>
      <Footer />
    </>
  );
}
