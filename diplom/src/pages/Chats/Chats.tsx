import { CircleArrowUp } from "lucide-react";
import Header from "../../components/Header/Header";
import styles from "./Chats.module.css";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import axios from "axios";

interface User {
  id: number;
  name: string;
  avatar: string;
}

interface ChatMessagesProps {
  id: number;
  time: string;
  recipient_id: number;
  sender_id: number;
  message: string;
}

function Chats() {
  const [inputValue, setInputValue] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<ChatMessagesProps[]>([]);
  const [userId, setUserId] = useState<number | null>(null); // Изменено на number | null

  useEffect(() => {
    const fetchData = async () => {
      const jwt = Cookies.get("jwt");
      if (!jwt) return;

      try {
        const decoded = jwtDecode<{ sub: string }>(jwt);
        const user_id = parseInt(decoded.sub, 10);
        setUserId(user_id);
        await getAllChats(user_id);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (selectedUser && userId) {
      getMessages(userId, selectedUser.id);
    }
  }, [selectedUser, userId]);

  const getAllChats = async (user_id: number) => {
    try {
      const response = await axios.get<User[]>(
        `http://127.0.0.1:8000/chat/members`,
        {
          params: {
            user_id: user_id,
          },
        }
      );
      setUsers(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const getMessages = async (sender_id: number, recipient_id: number) => {
    try {
      const response = await axios.get<ChatMessagesProps[]>(
        `http://127.0.0.1:8000/chat/messages/${sender_id}/${recipient_id}`
      );
      setMessages(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const postMessage = async () => {
    if (!userId || !selectedUser || !inputValue.trim()) return;

    try {
      const messageData = {
        time: new Date().toISOString(),
        recipient_id: selectedUser.id,
        sender_id: userId,
        message: inputValue,
      };

      await axios.post("http://127.0.0.1:8000/chat/message", messageData);
      setInputValue("");
      getMessages(userId, selectedUser.id); // Обновляем сообщения после отправки
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <>
      <Header />
      <div className={styles.main}>
        <div className={styles.topbar}>
          <div className={styles.all_messages}>
            <p>Все сообщения</p>
          </div>
          {selectedUser && (
            <div className={styles.selected_user}>
              <p>{selectedUser.name}</p>
            </div>
          )}
        </div>

        <div className={styles.menu}>
          <div className={styles.blocks}>
            {users.map((user) => (
              <div
                key={user.id}
                className={`${styles.people_block} ${
                  selectedUser?.id === user.id ? styles.selected : ""
                }`}
                onClick={() => setSelectedUser(user)}
              >
                <img
                  src={`http://127.0.0.1:8000/${user.avatar}`}
                  width={75}
                  height={75}
                  alt={user.name}
                />
                <p>{user.name}</p>
              </div>
            ))}
          </div>

          <div className={styles.chat}>
            <div className={styles.newMessage}>
              <div className={styles.messagesContainer}>
                {messages
                  .filter(msg => msg.message.length > 0) // Фильтруем сообщения с длиной > 0
                  .map((msg) => (
                    <div
                      key={msg.id}
                      className={`${styles.message} ${
                        msg.sender_id === userId ? styles.sent : styles.received
                      }`}
                    >
                      <p>{msg.message}</p>
                      <span className={styles.time}>
                        {new Date(msg.time).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  ))
                }
              </div>
            </div>

            {selectedUser && (
              <div className={styles.input}>
                <input
                  placeholder="Написать сообщение"
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && postMessage()}
                />
                <CircleArrowUp
                  className={styles.icon}
                  onClick={postMessage}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Chats;