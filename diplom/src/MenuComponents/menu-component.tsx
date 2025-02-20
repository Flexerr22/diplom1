import { Container } from "../components/Container/Container";
import { Filters } from "../components/Filters/Filters";
import { Products } from "../components/Products/Products";
import styles from './menu-components.module.css'

export function MenuComponent(){
    return(
        <Container>
            <div className={styles['main']}>
                <Filters />
                <Products />
            </div>
        </Container>
    )
}