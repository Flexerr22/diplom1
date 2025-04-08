import { useState } from "react";
import { Container } from "../Container/Container";
import { Filters } from "../Filters/Filters";
import { RolesGroupInvestor } from "../RolesGroupInvestor/RolesGroupInvestor";
import styles from "./MenuInvestor.module.css";

export function MenuInvestor() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedInvest, setSelectedInvest] = useState<string[]>([]);
  return (
    <Container>
      <div className={styles["main"]}>
        <Filters
          onInvestChange={setSelectedInvest}
          onCategoryChange={setSelectedCategories}
        />
        <RolesGroupInvestor
          selectedInvest={selectedInvest}
          selectedCategories={selectedCategories}
        />
      </div>
    </Container>
  );
}
