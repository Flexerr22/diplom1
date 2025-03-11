import { Container } from "../Container/Container";
import { RolesGroupInvestor } from "../RolesGroupInvestor/RolesGroupInvestor";
import styles from "./MenuInvestor.module.css";

export function MenuInvestor() {
  return (
    <Container>
      <div className={styles["main"]}>
        {/* <Filters /> */}
        <RolesGroupInvestor />
      </div>
    </Container>
  );
}
