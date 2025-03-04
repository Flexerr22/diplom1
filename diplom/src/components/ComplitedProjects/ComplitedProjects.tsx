import { Container } from "../Container/Container";
import styles from "./ComplitedProjects.module.css";

export function ComplitedProject() {
  return (
    <Container>
      <div className={styles["main"]}>
        <div className={styles["main_text"]}>
          <p>
            Что вы <span>получите</span> от нашего
            <span> приложения</span>
          </p>
        </div>
        <div className={styles["projects"]}>
          <div className={styles["project"]}>
            <div className={styles["image-wrapper"]}>
              <img src="/project1.avif" alt="Project Image" />
            </div>
            <p>Реализация чего-то маштабного</p>
          </div>

          <div className={styles["project"]}>
            <div className={styles["image-wrapper"]}>
              <img src="/money.avif" alt="Project Image" />
            </div>
            <p>Помощь выйти на новый уровень дохода</p>
          </div>

          <div className={styles["project"]}>
            <div className={styles["image-wrapper"]}>
              <img src="/business.avif" alt="Project Image" />
            </div>
            <p>Создание чего-то нового</p>
          </div>

          <div className={styles["project"]}>
            <div className={styles["image-wrapper"]}>
              <img src="/team.avif" alt="Project Image" />
            </div>
            <p>Приобритение навыков работы в команде</p>
          </div>
        </div>
      </div>
    </Container>
  );
}
