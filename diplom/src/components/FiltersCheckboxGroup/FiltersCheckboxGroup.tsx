import { useState } from "react";
import {
  FiltersCheckbox,
  FiltersCheckboxProps,
} from "../FiltersCheckbox/FiltersCheckbox";
import styles from "./FiltersCheckboxGroup.module.css";

type Item = FiltersCheckboxProps;

export interface FiltersCheckboxGroupProps {
  name: string;
  title: string;
  className?: string;
  items: Item[];
  defaultItems?: Item[];
  onClickCheckbox?: (id: string) => void;
  limit?: number;
  defaultValue?: string[];
  searchInputPlaceholder?: string;
}
export function FiltersCheckboxGroup({
  title,
  items,
  defaultItems,
  onClickCheckbox,
  limit = 5,
  searchInputPlaceholder = "Поиск...",
}: FiltersCheckboxGroupProps) {
  const [showAll, setShowAll] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const list = showAll
    ? items.filter((item) =>
        item.text.toLowerCase().includes(searchValue.toLocaleLowerCase())
      )
    : (defaultItems || items).slice(0, limit);

  const onChangeSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };
  return (
    <div className={styles["main"]}>
      <p>{title}</p>
      {showAll && (
        <div className="mb-5">
          <input
            onChange={onChangeSearchInput}
            placeholder={searchInputPlaceholder}
            className={styles["input-search"]}
          />
        </div>
      )}

      {list.map((item, index) => (
        <FiltersCheckbox
          key={index}
          name={item.name}
          text={item.text}
          value={item.value}
          endAdornment={item.endAdornment}
          checked={item.checked}
          onCheckedChange={() => onClickCheckbox?.(item.value)}
        />
      ))}
      {items.length > limit && (
        <div className={showAll ? "border-t border-t-neutral-100 mt-4" : ""}>
          <button
            onClick={() => setShowAll(!showAll)}
            className={styles["button_new"]}
          >
            {showAll ? "Скрыть" : "+ Показать все"}
          </button>
        </div>
      )}
    </div>
  );
}
