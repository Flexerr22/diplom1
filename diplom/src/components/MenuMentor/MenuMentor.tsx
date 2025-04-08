import { useState } from "react";
import { Container } from "../Container/Container";
import { Filters } from "../Filters/Filters";
import { RolesGroupMentor } from "../RolesGroupMentor/RolesGroupMentor";
import styles from "./MenuMentor.module.css";

export function MenuMentor() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedExperience, setSelectedExperience] = useState<string[]>([]);
  return (
    <Container>
      <div className={styles["main"]}>
        <Filters
          onExperienceChange={setSelectedExperience}
          onCategoryChange={setSelectedCategories}
        />
        <RolesGroupMentor
          selectedExperience={selectedExperience}
          selectedCategories={selectedCategories}
        />
      </div>
    </Container>
  );
}
