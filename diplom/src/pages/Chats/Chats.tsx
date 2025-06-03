import { Check, CircleArrowUp, Pen, Trash2, X } from "lucide-react";
import Header from "../../components/Header/Header";
import styles from "./Chats.module.css";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import axios from "axios";
import { Container } from "../../components/Container/Container";
import { Modal } from "../../components/Modal/Modal";
import Button from "../../components/Button/Button";

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
  const [isAuthtozise, setIsAuthtorize] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState<number | null>(null);
  const [editedMessage, setEditedMessage] = useState("");
  
  useEffect(() => {
    const jwt = Cookies.get("jwt");
    setIsAuthtorize(!!jwt); // Обновляем при каждом изменении jwt
  }, []);

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

  const deleteMessage = async (message_id: number) => {
  try {
    await axios.delete(`http://127.0.0.1:8000/chat/message/${message_id}`);
    // Удаляем сообщение из локального состояния
    setMessages(prev => prev.filter(msg => msg.id !== message_id));
      } catch (error) {
        console.error("Ошибка при удалении сообщения:", error);
      }
    }

    const editMessage = async (message_id: number) => {
        if (!editedMessage.trim()) return;
        
        try {
          await axios.patch(
            `http://127.0.0.1:8000/chat/message/${message_id}`,
            { new_message: editedMessage }
          );
          
          setMessages(prev =>
            prev.map(msg =>
              msg.id === message_id ? { ...msg, message: editedMessage } : msg
            )
          );
          setEditingMessageId(null);
          setEditedMessage("");
        } catch (error) {
          console.error("Ошибка при редактировании сообщения:", error);
        }
      };

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

  if(!isAuthtozise){
    return (
      <>
      <Header />
      <Container>
        <div className={styles.auth}>
        <b>Вы еще неавторизованы в системе. Пожалуйста авторизуйтесь чтобы иметь возможность общаться с другими пользователями</b>
          <Button
            appearence="big"
            className={styles["button_register_info"]}
            onClick={() => setModalOpen(true)}
          >
            Зарегистрироваться
          </Button>
          </div>
        {modalOpen && (
          <div className={styles["modal_main"]}>
            <div className={styles["modal_secondary"]}>
              <button
                      onClick={() => setModalOpen(false)}
                      className={styles["close"]}
                    >
                      ✖
                    </button>
              <Modal 
                closeModal={() => setModalOpen(false)} 
                setIsAuth={(value) => {
                  setIsAuthtorize(value);
                  setModalOpen(false);
                }} 
              />
            </div>
          </div>
        )}
        </Container>
    </>
    )
  }

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
                  .filter(msg => msg.message.length > 0)
                  .map((msg) => (
                    <div
                      key={msg.id}
                      className={`${styles.message} ${
                        msg.sender_id === userId ? styles.sent : styles.received
                      }`}
                    >
                      {editingMessageId === msg.id ? (
                        <div className={styles.editContainer}>
                          <input
                            value={editedMessage}
                            onChange={(e) => setEditedMessage(e.target.value)}
                            className={styles.editInput}
                            autoFocus
                          />
                          <div className={styles.editButtons}>
                            <Check 
                              size={18} 
                              className={styles.iconConfirm}
                              onClick={() => editMessage(msg.id)}
                            />
                            <X 
                              size={18} 
                              className={styles.iconCancel}
                              onClick={() => {
                                setEditingMessageId(null);
                                setEditedMessage("");
                              }}
                            />
                          </div>
                        </div>
                      ) : (
                        <p>{msg.message}</p>
                      )}
                      <div>
                        <div className={styles.message_icons}>
                          {msg.sender_id === userId && editingMessageId !== msg.id && (
                            <>
                              <Pen 
                                size={20} 
                                onClick={() => {
                                  setEditingMessageId(msg.id);
                                  setEditedMessage(msg.message);
                                }}
                              />
                              <Trash2 
                                size={20} 
                                className={styles.icon_delete} 
                                onClick={() => deleteMessage(msg.id)}
                              />
                            </>
                          )}
                        </div>
                        <span className={styles.time}>
                          {new Date(msg.time).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
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