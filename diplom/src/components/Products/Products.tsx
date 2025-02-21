import { Product, ProductProps } from "../Product/Product";
import Search from "../Search/Search";
import styles from "./Products.module.css";

export interface ProductsProps extends ProductProps {
  items: any[];
}

export function Products({ items }: ProductsProps) {
  return (
    <div className={styles["main"]}>
      <Search isValid={false} />
      <div className={styles["products"]}>
        {items.map((item, index) => (
          <Product
            key={index}
            details={item.details}
            title={item.title}
            valueDescription={item.valueDescription}
            value={item.value}
            unit={item.unit}
            rating={item.rating}
          />
        ))}
      </div>
    </div>
  );
}
