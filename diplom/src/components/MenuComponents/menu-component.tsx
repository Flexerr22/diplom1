import { Container } from "../Container/Container";
import { Filters } from "../Filters/Filters";
import { Products } from "../Products/Products";
import styles from "./menu-components.module.css";

export function MenuComponent() {
  return (
    <Container>
      <div className={styles["main"]}>
        <Filters />
        <Products />
      </div>
    </Container>
  );
}
