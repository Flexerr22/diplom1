import { Checkbox } from '../Checkbox/checkbox';
import styles from './FiltersCheckbox.module.css';

export interface FiltersCheckboxProps {
    text: string;
    value: string;
    endAdornment?: React.ReactNode;
    onCheckedChange?: (checked: boolean) => void;
    checked?: boolean;
    name?: string;
}

export function FiltersCheckbox({
    text,
    value,
    endAdornment,
    onCheckedChange,
    checked,
    name,
}: FiltersCheckboxProps) {
    return (
        <div className={styles['checkbox']}>
            <Checkbox
                onCheckedChange={onCheckedChange}
                checked={checked}
                value={value}
                id={`checkbox-${String(name)}-${String(value)}`.replace(/\s+/g, '-')}
            />
            <label
                htmlFor={`checkbox-${String(name)}-${String(value)}`.replace(/\s+/g, '-')}
            >
                {text}
            </label>
            {endAdornment && <span>{endAdornment}</span>}
        </div>
    );
}