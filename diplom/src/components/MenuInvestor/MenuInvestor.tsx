import { Container } from "../Container/Container";
import { Filters } from "../Filters/Filters";
import { RolesGroupInvestor } from "../RolesGroupInvestor/RolesGroupInvestor";
import styles from "./MenuInvestor.module.css";

export function MenuInvestor() {
  return (
    <Container>
      <div className={styles["main"]}>
        <Filters />
        <RolesGroupInvestor />
      </div>
    </Container>
  );
}
