import { Container } from "../Container/Container";
import { Filters } from "../Filters/Filters";
import { Products } from "../Products/Products";
import styles from "./menu-components.module.css";

export function MenuComponent() {
  return (
    <Container>
      <div className={styles["main"]}>
        <Filters />
        <Products
          items={[
            {
              id: 1,
              details:
                "Проект по созданию мобильного приложения для мониторинга здоровья пациентов.",
              title: "Медицинское приложение",
              value: 300000,
              unit: "руб.",
              valueDescription: "Требуются вложения",
              rating: 4.8,
            },
            {
              id: 2,
              details:
                "Образовательная платформа для обучения начинающих предпринимателей основам бизнеса.",
              title: "Обучающая платформа",
              value: 500000,
              unit: "руб.",
              valueDescription: "Требуются вложения",
              rating: 4.5,
            },
            {
              id: 3,
              details:
                "Наставник с более чем 10-летним опытом в разработке веб-приложений и мобильных платформ.",
              title: "Наставник IT",
              value: 10,
              unit: "лет",
              valueDescription: "Опыт работы",
              rating: 4.9,
            },
            {
              id: 4,
              details:
                "Консультирует стартапы по финансовым вопросам, включая разработку бизнес-планов и привлечение инвестиций.",
              title: "Финансовый наставник",
              value: 8,
              unit: "лет",
              valueDescription: "Опыт работы",
              rating: 4.7,
            },
            {
              id: 5,
              details:
                "Наставник по маркетингу с опытом работы в крупных международных компаниях.",
              title: "Наставник по маркетингу",
              value: 12,
              unit: "лет",
              valueDescription: "Опыт работы",
              rating: 4.8,
            },
            {
              id: 6,
              details:
                "Инвестирует в стартапы на ранних стадиях, специализируется на IT-проектах.",
              title: "Бизнес-ангел",
              value: 5000000,
              unit: "руб.",
              valueDescription: "Бюджет",
              rating: 4.6,
            },
            {
              id: 7,
              details:
                "Фонд, инвестирующий в проекты с высоким потенциалом роста в сфере медицины.",
              title: "Венчурный фонд",
              value: 10000000,
              unit: "руб.",
              valueDescription: "Бюджет",
              rating: 4.5,
            },
            {
              id: 8,
              details:
                "Частный инвестор, заинтересованный в проектах в области экологически чистых технологий.",
              title: "Частный инвестор",
              value: 2000000,
              unit: "руб.",
              valueDescription: "Бюджет",
              rating: 4.7,
            },
            {
              id: 9,
              details:
                "Платформа для взаимодействия наставников и предпринимателей с возможностью онлайн-обучения и консультаций.",
              title: "Платформа наставников",
              value: 750000,
              unit: "руб.",
              valueDescription: "Требуются вложения",
              rating: 4.9,
            },
            {
              id: 10,
              details:
                "Программа акселерации стартапов с инвестициями на начальных стадиях. Программа акселерации стартапов с инвестициями на начальных стадиях.Программа акселерации стартапов с инвестициями на начальных стадиях.",
              title: "Стартап-инкубатор",
              value: 5000000,
              unit: "руб.",
              valueDescription: "Требуются вложения",
              rating: 4.6,
            },
          ]}
        />
      </div>
    </Container>
  );
}
