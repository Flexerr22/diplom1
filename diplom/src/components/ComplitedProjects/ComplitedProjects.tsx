import Button from "../Button/Button";
import { Container } from "../Container/Container";
import styles from "./ComplitedProjects.module.css";

export function ComplitedProject() {
  return (
    <Container>
      <div className={styles["main"]}>
        <div className={styles["main_text"]}>
          <p>
            Проекты, которые <span>уже</span> были
            <span> реализованы</span>
          </p>
        </div>
        <div className={styles["projects"]}>
          <div className={styles["project"]}>
            <div className={styles["image-wrapper"]}>
              <img src="/project1.avif" alt="Project Image" />
            </div>
            <p>Реализация чего-то</p>
            <div className={styles["text"]}>
              <p>Ознакомится</p>
              <img width={25} color="white" src="/next.svg" alt="Next" />
            </div>
          </div>

          <div className={styles["project"]}>
            <div className={styles["image-wrapper"]}>
              <img src="/money.avif" alt="Project Image" />
            </div>
            <p>Помощь выйти на новый уровень дохода</p>
            <div className={styles["text"]}>
              <p>Ознакомится</p>
              <img width={25} color="white" src="/next.svg" alt="Next" />
            </div>
          </div>

          <div className={styles["project"]}>
            <div className={styles["image-wrapper"]}>
              <img src="/business.avif" alt="Project Image" />
            </div>
            <p>Реализация чего-то</p>
            <div className={styles["text"]}>
              <p>Ознакомится</p>
              <img width={25} color="white" src="/next.svg" alt="Next" />
            </div>
          </div>

          <div className={styles["project"]}>
            <div className={styles["image-wrapper"]}>
              <img src="/team.avif" alt="Project Image" />
            </div>
            <p>Работы в команде</p>
            <div className={styles["text"]}>
              <p>Ознакомится</p>
              <img width={25} color="white" src="/next.svg" alt="Next" />
            </div>
          </div>
        </div>
        <Button appearence="big" className={styles["button_projects"]}>
          Смотреть все
        </Button>
      </div>
    </Container>
  );
}
