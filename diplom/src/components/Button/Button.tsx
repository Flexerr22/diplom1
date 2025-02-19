import { ButtonHTMLAttributes, ReactNode } from "react";
import styles from './Button.module.css';
import cn from 'classnames';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>{
    children?: ReactNode;
    className?: string;
    appearence?: 'big' | 'small';
}

function Button({children, appearence, className, ...props}: ButtonProps){
    return (
        <button  className={cn(styles['button'], className, {
            [styles['small']]: appearence === 'small',
            [styles['big']]: appearence === 'big'
        })} {...props}>{children}</button>
    )
}

export default Button