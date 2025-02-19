import Button from '../Button/Button';
import { Container } from '../Container/Container';
import styles from './Users.module.css';

function Users (){
    return(
        <div className={styles['black-background']}>
            <Container>
                <main className={styles['main']}>
                    <div className={styles['text-block']}>
                        <p>Выбирайте что для вас <span>интересно</span></p>
                        <div className={styles['fone']}></div>
                        <Button appearence='big' className={styles['text-button']}>Создать проект</Button>
                    </div>

                    <div className={styles['users-block']}>
                        <div className={styles['user-info']}>
                            <p className={styles['number']}>01</p>
                            <div className={styles['person']}>
                                <img width={75} height={75} src='/person.png' alt='User'/>
                                <p>Предприниматели</p>
                            </div>
                            <button className={styles['button']}>Перейти к выбору</button>
                        </div>

                        <div className={styles['user-info_new']}>
                            <p className={styles['number']}>02</p>
                            <div className={styles['person_new']}>
                                <img width={50} height={50} src='/person.png' alt='User'/>
                                <p>Наставники</p>
                            </div>
                        </div>
                        
                        <div className={styles['user-info_new']}>
                            <p className={styles['number']}>03</p>
                            <div className={styles['person_new']}>
                                <img width={50} height={50} src='/person.png' alt='User'/>
                                <p>Инвесторы</p>
                            </div>
                        </div>
                    </div>
                </main>
            </Container>
        </div>
    )
}

export default Users