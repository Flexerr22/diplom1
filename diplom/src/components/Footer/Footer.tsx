import { Mail, Phone } from "lucide-react";
import { Container } from "../Container/Container";
import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles["footer"]}>
      <Container>
        <div className={styles["footer_top"]}>
          <div className={styles["title"]}>
            <p>Инвесторам</p>
            <div className={styles["footer_text"]}>
              <p>Как начать?</p>
              <p>Проекты</p>
              <p>О нас</p>
            </div>
          </div>

          <div className={styles["title"]}>
            <p>Предпринимателям</p>
            <div className={styles["footer_text"]}>
              <p>Как начать?</p>
              <p>Проекты</p>
              <p>О нас</p>
            </div>
          </div>

          <div className={styles["title"]}>
            <p>Наставникам</p>
            <div className={styles["footer_text"]}>
              <p>Как начать?</p>
              <p>Проекты</p>
              <p>О нас</p>
            </div>
          </div>
        </div>

        <div className={styles["footer_bottom"]}>
          <div className={styles["main"]}>
            <div className={styles["footer_block"]}>
              <Mail size={20} color="#444497" />
              <p>testemail@gmail.com</p>
            </div>
            <div className={styles["footer_block"]}>
              <Phone size={20} color="#444497" />
              <p>8-939-360-91-36</p>
            </div>
          </div>
          <button className={styles["button_help"]}>Служба поддержки</button>
        </div>
      </Container>
    </footer>
  );
}
