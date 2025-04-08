import { useState } from "react";
import { Container } from "../Container/Container";
import { Filters } from "../Filters/Filters";
import { Products } from "../Products/Products";
import styles from "./menu-components.module.css";

export function MenuComponent() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedStages, setSelectedStages] = useState<string[]>([]);
  const [selectedInvest, setSelectedInvest] = useState<string[]>([]);
  const [selectedExperience, setSelectedExperience] = useState<string[]>([]);
  return (
    <Container>
      <div className={styles["main"]}>
        <Filters
          onInvestChange={setSelectedInvest}
          onExperienceChange={setSelectedExperience}
          onStageChange={setSelectedStages}
          onCategoryChange={setSelectedCategories}
        />
        <Products
          selectedExperience={selectedExperience}
          selectedInvest={selectedInvest}
          selectedStages={selectedStages}
          selectedCategories={selectedCategories}
        />
      </div>
    </Container>
  );
}
