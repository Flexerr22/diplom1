
import { FiltersCheckboxGroup } from "../FiltersCheckboxGroup/FiltersCheckboxGroup";
import { SortPopup } from "../SortPopup/sortpopup";
import styles from './Filters.module.css'

export function Filters(){
    return(
        <div className={styles['main']}>
            <SortPopup />
            <div className={styles['checkbox']}>
                <p className={styles['title']}>Фильтрация</p>
                <div className={styles['checkbox_group']}>
                    <FiltersCheckboxGroup 
                        name='new'
                        className={styles['filter']}
                        title="По дате выкладки"
                        defaultItems={[
                            {text: 'Все', value: 'Все'},
                            {text: 'Новые', value: 'Новые'},
                        ]}
                        items={[
                            {text: 'Наставник', value: 'Наставник'},
                            {text: 'Инвестор', value: 'Инвестор'}
                        ]}
                    />

                    <FiltersCheckboxGroup 
                        name='new'
                        className={styles['filter']}
                        title="Кого ищете"
                        defaultItems={[
                            {text: 'Наставник', value: 'Наставник'},
                            {text: 'Инвестор', value: 'Инвестор'},
                        ]}
                        items={[
                            {text: 'Наставник', value: 'Наставник'},
                            {text: 'Инвестор', value: 'Инвестор'}
                        ]}
                    />

                    <FiltersCheckboxGroup 
                        name='new'
                        className={styles['filter']}
                        title="Кого ищете"
                        defaultItems={[
                            {text: 'Наставник', value: 'Наставник'},
                            {text: 'Инвестор', value: 'Инвестор'},
                            {text: 'Наставник', value: 'Наставник'},
                            {text: 'Инвестор', value: 'Инвестор'},
                            {text: 'Наставник', value: 'Наставник'},
                        ]}
                        items={[
                            {text: 'Наставник', value: 'Наставник'},
                            {text: 'Инвестор', value: 'Инвестор'},
                            {text: 'Наставник', value: 'Наставник'},
                            {text: 'Инвестор', value: 'Инвестор'},
                            {text: 'Наставник', value: 'Наставник'},
                            {text: 'Инвестор', value: 'Инвестор'},
                            {text: 'Наставник', value: 'Наставник'},
                            {text: 'Инвестор', value: 'Инвестор'},
                            {text: 'Наставник', value: 'Наставник'},
                            {text: 'Инвестор', value: 'Инвестор'},
                        ]}
                    />
                </div>
                <button className={styles['podbor']}>Подобрать</button>
            </div>
        </div>
    )
}