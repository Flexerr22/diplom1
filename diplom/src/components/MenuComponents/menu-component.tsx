import { useEffect, useState } from "react";
import { Container } from "../Container/Container";
import { Filters } from "../Filters/Filters";
import { Products } from "../Products/Products";
import styles from "./menu-components.module.css";
import Cookies from "js-cookie";
import { RolesGroup } from "../RolesGroup/RolesGroup";

export function MenuComponent() {
  const [roleItem, setRoleItem] = useState<string | null>(null);

  useEffect(() => {
    const role = Cookies.get("role");

    if (role) {
      setRoleItem(role);
    }
  }, []);
  return (
    <Container>
      <div className={styles["main"]}>
        <Filters />
        {roleItem === "mentor" || roleItem === "investor" ? (
          <Products />
        ) : (
          <RolesGroup />
        )}
      </div>
    </Container>
  );
}
