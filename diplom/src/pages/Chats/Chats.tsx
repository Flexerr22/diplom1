import { ArrowUpDown, CircleArrowUp } from "lucide-react";
import Header from "../../components/Header/Header";
import styles from "./Chats.module.css";

function Chats() {
  return (
    <>
      <Header />
      <div className={styles.main}>
        <div className={styles.topbar}>
          <div className={styles.all_messages}>
            <p>Все сообщения</p>
            <ArrowUpDown size={16} />
          </div>

          <div className={styles.messages}>
            <p className={styles.title_name}>Никита</p>
            <p className={styles.title_time}>был в сети: 22:48</p>
          </div>
        </div>

        <div className={styles.menu}>
          <div className={styles.blocks}>
            <div className={styles.people_block}>
              <img src="/team.avif" width={50} height={50} alt="Пользователь" />
              <div>
                <b>Никита</b>
                <p>Последнее сообщение</p>
              </div>
            </div>

            <div className={styles.people_block}>
              <img src="/team.avif" width={50} height={50} alt="Пользователь" />
              <div>
                <b>Никита</b>
                <p>Последнее сообщение</p>
              </div>
            </div>

            <div className={styles.people_block}>
              <img src="/team.avif" width={50} height={50} alt="Пользователь" />
              <div>
                <b>Никита</b>
                <p>Последнее сообщение</p>
              </div>
            </div>
          </div>

          <div className={styles.chat}>
            <div className={styles.newMessage}>
              <p>Я что-то написал</p>
              <p className={styles.chat_time}>22:48</p>
            </div>
            <div className={styles.input}>
              <input placeholder="Написать сообщение" type="text" />
              <CircleArrowUp className={styles.icon} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Chats;
