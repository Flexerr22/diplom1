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
  onChange?: (value: string[]) => void;
}
export function FiltersCheckboxGroup({
  title,
  items,
  defaultItems,
  onClickCheckbox,
  limit = 5,
  searchInputPlaceholder = "Поиск...",
  onChange,
  defaultValue = [],
}: FiltersCheckboxGroupProps) {
  const [showAll, setShowAll] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [selectedValues, setSelectedValues] = useState<string[]>(defaultValue);

  const list = showAll
    ? items.filter((item) =>
        item.text.toLowerCase().includes(searchValue.toLocaleLowerCase())
      )
    : (defaultItems || items).slice(0, limit);

  const onChangeSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleCheckboxChange = (value: string) => {
    let newSelectedValues;

    if (selectedValues.includes(value)) {
      newSelectedValues = selectedValues.filter((v) => v !== value);
    } else {
      newSelectedValues = [...selectedValues, value];
    }

    setSelectedValues(newSelectedValues);

    // Вызываем внешний обработчик с новыми значениями
    if (onChange) {
      onChange(newSelectedValues);
    }

    // Вызываем onClickCheckbox если он передан
    if (onClickCheckbox) {
      onClickCheckbox(value);
    }
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
          checked={selectedValues.includes(item.value)} // Управляем состоянием чекбокса
          onCheckedChange={() => handleCheckboxChange(item.value)}
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
