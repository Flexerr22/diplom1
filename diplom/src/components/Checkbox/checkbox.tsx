import styles from './checkbox.module.css';

interface CheckboxProps {
    onCheckedChange?: (checked: boolean) => void;
    checked?: boolean;
    value?: string;
    id?: string;
    name?: string;
}

export function Checkbox({
    onCheckedChange,
    checked,
    ...props
}: CheckboxProps) {
    return (
        <div>
            <input
                type="checkbox"
                className={styles.checkbox}
                checked={checked}
                onChange={(e) => onCheckedChange?.(e.target.checked)}
                {...props}
            />
        </div>
    );
}