import { useEffect, useState } from "react";
import Button from "../Button/Button";
import { Container } from "../Container/Container";
import styles from "./Users.module.css";
import { useLocation, useNavigate } from "react-router-dom";

function Users() {
  const location = useLocation();
  const [focusedId, setFocusedId] = useState(1);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const selectedId = params.get("focusedId");
    if (selectedId) {
      setFocusedId(Number(selectedId));
      setSelectedId(Number(selectedId));
    }
  }, [location]);

  const navigate = useNavigate();

  const handleNavigate = (id: number) => {
    setFocusedId(id);
    setSelectedId(id);

    const path = id === 1 ? "/businessman" : id === 2 ? "/mentor" : "/investor";
    navigate(`${path}?focusedId=${id}`);
  };

  const isHomePage = location.pathname === "/";

  return (
    <div className={styles["black-background"]}>
      <Container>
        <main className={styles["main"]}>
          <div className={styles["text-block"]}>
            <p>
              {isHomePage ? (
                <>
                  <span className={styles.first}>Выбирайте что для вас</span>{" "}
                  <span className={styles.highlight}>интересно</span>
                </>
              ) : selectedId === 1 ? (
                <>
                  <span className={styles.firstWord}>Предприниматель</span> -
                  сможете найти наставников и инвесторов для своих проектов
                </>
              ) : selectedId === 2 ? (
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
            <Button appearence="big" className={styles["text-button"]}>
              Создать проект
            </Button>
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
                onClick={() => setFocusedId(id)}
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
                {focusedId === id && (
                  <button
                    onClick={() => handleNavigate(id)}
                    className={styles["button"]}
                  >
                    {selectedId === id ? "Вы выбрали" : "Перейти к выбору"}
                  </button>
                )}
              </div>
            ))}
          </div>
        </main>
      </Container>
    </div>
  );
}

export default Users;
