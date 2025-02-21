import Button from "../Button/Button";
import { Container } from "../Container/Container";
import styles from "./Info.module.css";

export function Info() {
  return (
    <Container>
      <div className={styles["main"]}>
        <div className={styles["info"]}>
          <img src="/logo.svg" width={50} height={50} />
          <p>
            <span className={styles["span1"]}>Mentor Connect</span> - площадка,
            предназначенная для воплощения{" "}
            <span className={styles["span2"]}>ваших идей</span> ! Станьте частью
            нашего проекта прямо сейчас !
          </p>
        </div>
        <Button appearence="big" className={styles["button_register_info"]}>
          Зарегистрироваться
        </Button>
      </div>
    </Container>
  );
}
