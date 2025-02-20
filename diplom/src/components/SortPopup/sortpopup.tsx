import { ArrowUpDown } from "lucide-react";
import styles from './sortpopup.module.css'

export function SortPopup(){
    return(
        <div className={styles['sort']}>
            <ArrowUpDown size={16}/>
            <b>Сортировка:</b>
            <p>популярное</p>
        </div>
    )
}