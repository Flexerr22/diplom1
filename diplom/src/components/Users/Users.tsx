import { useState } from "react";
import Button from "../Button/Button";
import { Container } from "../Container/Container";
import styles from "./Users.module.css";

function Users() {
  const [focusedId, setFocusedId] = useState(1);
  const [selectedId, setSelectedId] = useState<number | null>(0);

  const handleRoleClick = (id: number) => {
    setFocusedId(id);
    setSelectedId(id);
  };

  return (
    <div className={styles["black-background"]}>
      <Container>
        <main className={styles["main"]}>
          <div className={styles["text-block"]}>
            <p>
              {selectedId === 0 ? (
                <>
                  <span className={styles.first}>Выбирайте что для вас</span>{" "}
                  <span className={styles.highlight}>интересно</span>
                </>
              ) : focusedId === 1 ? (
                <>
                  <span className={styles.firstWord}>Предприниматель</span> -
                  сможете найти наставников и инвесторов для своих проектов
                </>
              ) : focusedId === 2 ? (
                <>
                  <span className={styles.firstWord}>Наставник</span> - всегда
                  поможет вам улучшить ваш проект
                </>
              ) : (
                <>
                  <span className={styles.firstWord}>Инвестор</span> - сможет
                  вывести ваш проект на новый уровень
                </>
              )}
            </p>
            <div className={styles["fone"]}></div>
            <a href="/add">
              <Button appearence="big" className={styles["text-button"]}>
                Создать проект
              </Button>
            </a>
          </div>

          <div className={styles["users-block"]}>
            {[1, 2, 3].map((id) => (
              <div
                key={id}
                className={
                  focusedId === id
                    ? styles["user-info"]
                    : styles["user-info_new"]
                }
                onClick={() => handleRoleClick(id)}
              >
                <p className={styles["number"]}>{`0${id}`}</p>
                <div className={styles["person"]}>
                  <img
                    width={focusedId === id ? 75 : 50}
                    height={focusedId === id ? 75 : 50}
                    src="/person.png"
                    alt="User"
                  />
                  <p>
                    {id === 1
                      ? "Предприниматели"
                      : id === 2
                      ? "Наставники"
                      : "Инвесторы"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </main>
      </Container>
    </div>
  );
}

export default Users;
