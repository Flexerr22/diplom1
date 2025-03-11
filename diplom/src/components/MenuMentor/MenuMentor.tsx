import { Container } from "../Container/Container";
import { RolesGroupMentor } from "../RolesGroupMentor/RolesGroupMentor";
import styles from "./MenuMentor.module.css";

export function MenuMentor() {
  return (
    <Container>
      <div className={styles["main"]}>
        {/* <Filters /> */}
        <RolesGroupMentor />
      </div>
    </Container>
  );
}
