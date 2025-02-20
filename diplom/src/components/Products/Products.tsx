import { Product } from "../Product/Product";
import Search from "../Search/Search";
import styles from './Products.module.css'

export function Products(){
    return (
        <div className={styles['main']}>
            <Search isValid={false} />
            <div className={styles['products']}>
                <Product />
                <Product />
                <Product />
                <Product />
                <Product />
                <Product />
            </div>
        </div>
    )
}