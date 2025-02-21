// import { ArrowRight, CircleUserRound } from 'lucide-react';
import Button from "../Button/Button";
import styles from "./Header.module.css";
import { Container } from "../Container/Container";

function Header() {
  return (
    <div className={styles["color"]}>
      <Container>
        <header className={styles["header"]}>
          <div className={styles["logo"]}>
            <a href="/">
              Mentor<span>Connect</span>
            </a>
            <img src="/logo.svg" alt="Логотип" />
          </div>

          <nav className={styles["nav-text"]}>
            <ul className={styles["ul"]}>
              <li>
                <a href="/businessman">Предпринимателям</a>
              </li>
              <div className={styles["border"]}></div>
              <li>
                <a href="/mentor">Наставникам</a>
              </li>
              <div className={styles["border"]}></div>
              <li>
                <a href="/investor">Инвесторам</a>
              </li>
            </ul>
          </nav>

          <div className={styles["block-icons"]}>
            <nav className={styles["nav-icons"]}>
              <img src="/chat.svg" alt="Чаты" />
              <img src="/messages.svg" alt="Уведомления" />
              <img src="/like.svg" alt="Избранное" />
            </nav>
            <Button appearence="small" className={styles["button_header"]}>
              Войти
            </Button>
          </div>
        </header>
      </Container>
    </div>
  );
}

export default Header;
