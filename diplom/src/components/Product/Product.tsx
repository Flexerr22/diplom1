import { Star } from "lucide-react";
import Button from "../Button/Button";
import styles from './Product.module.css'

export function Product(){
    return(
        <div>
            <div className={styles['product']}>
                <p className={styles['description']}>Финансирование контрактов и проектов до 150 тыс. долл. США на партнерских и возвратных условиях</p>
                <b className={styles['budget']}>Бюджет: </b>
                <div className={styles['price']}>
                    <b>от 15000000</b>
                    <b>руб.</b>
                </div>
                <div className={styles['product-bottom']}>
                    <div className={styles['reit']}>
                        <p>Рейтинг: </p>
                        <p>4.5</p>
                        <Star size={17} color="#FFCC00"/>
                    </div>
                    <Button className={styles['button']}>Подробнее</Button>
                </div>
            </div>
        </div>
    )
}