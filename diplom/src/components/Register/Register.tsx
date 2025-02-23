import { useNavigate } from 'react-router-dom';
import styles from './Register.module.css'
import { useState } from 'react';
import axios from 'axios';

export type Register = {
    name: {
        value: string;
      };
    email: {
      value: string;
    };
    password: {
      value: string;
    };
  };

export interface RegisterProps{
    name: string,
    email: string,
    password: string
}

export function Register(){
    const navigate = useNavigate()
    const [error, setError] = useState(false)
    const [emailError, setEmailError] = useState(false)
    const [passwordError, setPasswordError] = useState(false)
    const [nameError, setNameError] = useState(false)
    const [data, setData] = useState({
        name: "",
        email: "",
        password: ""
    })

    const sendRegister = async () => {
        try{
            await axios.post<RegisterProps>('',
            {
                name,
                email,
                password
            })
        } catch () {

        }
    }
    return(
        <div className={styles['login']}>
            <p className={styles['title']}>Зарегистрировать аккаунт</p>
            <button className={styles.google}>
                <img src='/google.svg' width={20} height={20} alt='Иконка google'/>
                Регистрация с помощью Google
            </button>
            <div className={styles.border_or}>
                <div className={styles.border}></div>
                <p className={styles.or}>OR</p>
                <div className={styles.border}></div>
            </div>
            <form className={styles['form_login']}>
                 <div className={styles['input']}>
                    <label className={styles['label']}>Username</label>
                    <input 
                        type='text'
                        placeholder='Username'
                    />
                </div>
                <div className={styles['input']}>
                    <label className={styles['label']}>Email</label>
                    <input 
                        type='email'
                        placeholder='Email'
                    />
                </div>
                <div className={styles['input']}>
                    <label className={styles['label']}>Password</label>
                    <input 
                        type='password'
                        placeholder='Password'
                    />
                </div>
                <button type='button' className={styles['login_button']}>Регистрация</button>
            </form>   
        </div>
    )
}