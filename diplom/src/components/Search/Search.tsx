import { forwardRef, InputHTMLAttributes } from "react";
import cn from 'classnames'
import styles from './Search.module.css'

export interface SearchProps extends InputHTMLAttributes<HTMLInputElement> {
    isValid: boolean
}

const Search = forwardRef<HTMLInputElement, SearchProps>(function Input({isValid = true ,className, ...props}, ref){
    return (
        <div className={styles['input-wrapper']}>
            <input ref={ref} className={cn(styles['input'], className, {
                [styles['invalid']] : isValid,
            })} {...props}
            placeholder="Поиск"
            />
            <img className={styles['icon']} src="/search.svg" alt="" />
        </div>
    )
})

export default Search