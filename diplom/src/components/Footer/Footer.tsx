import {
  BookOpen,
  Cpu,
  Mail,
  Phone,
  Play,
  Rocket,
  ShieldCheck,
  Users,
} from "lucide-react";
import { Container } from "../Container/Container";
import styles from "./Footer.module.css";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

export function Footer() {
  const [userRole, setUserRole] = useState("");
  const [activeModal, setActiveModal] = useState(false);
  const [activeModalNew, setActiveModalNew] = useState(false);

  useEffect(() => {
    const role = Cookies.get("role");
    if (role) {
      setUserRole(role);
    }
  }, []);

  const handleClickOutside = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setActiveModal(null);
    }
  };

  const handleClickOutsideNew = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setActiveModalNew(null);
    }
  };

  const handleSupportClick = () => {
    // Замените ссылку на вашу реальную ссылку Telegram
    window.open("https://t.me/Flezx23", "_blank");
  };

  function CircleNumber({ number }: { number: number }) {
    return <div className={styles.circle}>{number}</div>;
  }

  return (
    <footer className={styles["footer"]}>
      <Container>
        <div className={styles["footer_top"]}>
          {userRole === "investor" && (
            <>
              <div className={styles["title"]}>
                <p>Инвесторам</p>
                <div className={styles["footer_text"]}>
                  <a onClick={() => setActiveModalNew(true)}>Как начать?</a>
                  <a href="/projects">Проекты</a>
                  <a onClick={() => setActiveModal(true)}>О нас</a>
                </div>
              </div>
            </>
          )}
          {userRole === "entrepreneur" && (
            <>
              <div className={styles["title"]}>
                <p>Предпринимателям</p>
                <div className={styles["footer_text"]}>
                  <a onClick={() => setActiveModalNew(true)}>Как начать?</a>
                  <a href="/mentor">Наставники</a>
                  <a href="/investor">Инвесторы</a>
                  <a onClick={() => setActiveModal(true)}>О нас</a>
                </div>
              </div>
            </>
          )}
          {userRole === "mentor" && (
            <>
              <div className={styles["title"]}>
                <p>Наставникам</p>
                <div className={styles["footer_text"]}>
                  <a onClick={() => setActiveModalNew(true)}>Как начать?</a>
                  <a href="/projects">Проекты</a>
                  <a onClick={() => setActiveModal(true)}>О нас</a>
                </div>
              </div>
            </>
          )}
        </div>

        <div className={styles["footer_bottom"]}>
          <div className={styles["main"]}>
            <div className={styles["footer_block"]}>
              <Mail size={20} color="#444497" />
              <p>ilia2005951@gmail.com</p>
            </div>
            <div className={styles["footer_block"]}>
              <Phone size={20} color="#444497" />
              <p>8-927-400-87-91</p>
            </div>
          </div>
          <button
            className={styles["button_help"]}
            onClick={handleSupportClick}
          >
            Служба поддержки
          </button>
        </div>

        {activeModal && (
          <>
            <div className={styles.modal_main} onClick={handleClickOutside}>
              <div className={styles.modal_secondary}>
                <div className={styles.header}>
                  <BookOpen size={20} color="#444497" />
                  <p>О платформе Mentor Connect</p>
                </div>
                <div className={styles.block}>
                  <div className={styles.feature}>
                    <Users size={55} />
                    <div>
                      <h4>Для кого</h4>
                      <p>
                        Платформа объединяет предпринимателей, наставников и
                        инвесторов для совместной работы над стартапами
                      </p>
                    </div>
                  </div>
                  <div className={styles.feature}>
                    <Rocket size={45} />
                    <div>
                      <h4>Наша миссия</h4>
                      <p>
                        Ускорение вывода идей на рынок через экспертную и
                        финансовую поддержку
                      </p>
                    </div>
                  </div>
                </div>
                <div className={styles.block}>
                  <div className={styles.feature}>
                    <Cpu size={18} />
                    <div>
                      <h4>Технологии</h4>
                      <p>
                        Frontend: React + TypeScript
                        <br />
                        Backend: Python + FastAPI
                        <br />
                        База данных: PostgreSQL
                      </p>
                    </div>
                  </div>
                  <div className={styles.feature}>
                    <ShieldCheck size={45} />
                    <div>
                      <h4>Безопасность</h4>
                      <p>
                        Все данные защищены, используется шифрование и
                        безопасное хранение
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeModalNew && (
          <>
            <div className={styles.modal_main} onClick={handleClickOutsideNew}>
              <div className={styles.modal_secondary}>
                <div className={styles.header}>
                  <Play size={20} color="#444497" />
                  <p>Как начать работу?</p>
                </div>
                <div className={styles.block}>
                  <div className={styles.step}>
                    <CircleNumber number={1} />
                    <div>
                      <h4>Регистрация</h4>
                      <p>
                        Выберите свою роль: предприниматель, наставник или
                        инвестор
                      </p>
                    </div>
                  </div>
                  <div className={styles.step}>
                    <CircleNumber number={2} />
                    <div>
                      <h4>Заполнение профиля</h4>
                      <p>
                        Добавьте информацию о себе, своих навыках или проектах
                      </p>
                    </div>
                  </div>
                </div>
                <div className={styles.block}>
                  <div className={styles.step}>
                    <CircleNumber number={3} />
                    <div>
                      <h4>Поиск партнеров</h4>
                      <p>
                        Используйте фильтры для нахождения подходящих проектов
                        или специалистов
                      </p>
                    </div>
                  </div>
                  <div className={styles.step}>
                    <CircleNumber number={4} />
                    <div>
                      <h4>Начало сотрудничества</h4>
                      <p>
                        Отправляйте заявки, общайтесь во встроенном чате,
                        работайте над проектами
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </Container>
    </footer>
  );
}
