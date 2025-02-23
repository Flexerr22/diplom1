import { useState } from 'react'
import styles from './Modal.module.css'
import { Login } from '../Login/Login'
import { Register } from '../Register/Register'

export function Modal(){
    const [isAuth, setIsAuth] = useState(false)
    return(
        <div className={styles['authtorize']}>
            <div className={styles['buttons']}>
                <button className={isAuth ? styles.auth : styles.register} onClick={() => setIsAuth(true)}>Авторизация</button>
                <button className={isAuth ? styles.register : styles.auth} onClick={() => setIsAuth(false)}>Регистрация</button>
            </div>
            {isAuth ? <Login  /> : <Register />}
        </div>
    )
}