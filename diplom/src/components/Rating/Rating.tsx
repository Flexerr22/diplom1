import { useEffect, useState } from "react";
import { ModalTypeAccept } from "../AcceptProject/AcceptProject";
import styles from "./Rating.module.css";
import Button from "../Button/Button";
import { ThumbsUp } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { MessageProps } from "../../helpers/message.props";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface RatingProps {
  setActiveModal: (value: ModalTypeAccept) => void;
}

export const Rating = ({ setActiveModal }: RatingProps) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState<string>("");
  const [notificationId, setNotificationId] = useState<number | null>(null);
  const [sender, setSender] = useState<number | null>();
  const navigate = useNavigate();

  const handleClickOutside = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setActiveModal(null);
    }
  };

  useEffect(() => {
    getMessage();
  }, []);

  const getMessage = async () => {
    const jwt = Cookies.get("jwt");
    if (!jwt) return;

    try {
      const decoded = jwtDecode<{ sub: string }>(jwt);
      const user_id = parseInt(decoded.sub, 10);

      const responce = await axios.get<MessageProps[]>(
        `http://127.0.0.1:8000/notifications/${user_id}`
      );

      const extMessage = responce.data.find(
        (notification) =>
          notification.recipient_id === user_id &&
          notification.status === "accepted"
      );
      setSender(extMessage?.sender_id);
      if (extMessage) {
        setNotificationId(extMessage.id);
      } else {
        setNotificationId(null);
      }
    } catch (error) {
      console.error("Произошла ошибка", error);
    }
  };

  const postRating = async () => {
    const jwt = Cookies.get("jwt");
    if (!jwt) return;

    try {
      const decoded = jwtDecode<{ sub: string }>(jwt);
      const user_id = parseInt(decoded.sub, 10);

      const reviewData = {
        user_id: sender,
        sender_id: user_id,
        amount: rating,
        review: reviewText,
      };

      await axios.post(
        `http://127.0.0.1:8000/ratings/create-rating/${sender}`,
        reviewData
      );
      deleteMessage();
      navigate("/");
    } catch (error) {
      console.error("Произошла ошибка", error);
    }
  };

  const deleteMessage = async () => {
    if (!notificationId) return;

    await axios.delete(
      `http://127.0.0.1:8000/notifications/delete-notification/${notificationId}`
    );

    if (getMessage) {
      await getMessage();
    }
    setNotificationId(null);
  };

  return (
    <div className={styles.modal_main} onClick={handleClickOutside}>
      <div className={styles.modal_secondary}>
        <div className={styles.header}>
          <p>Оцените сотрудничество</p>
        </div>
        <ThumbsUp size={50} />
        <form onSubmit={postRating} className={styles.form}>
          <div className={styles.block}>
            <p>Оставьте отзыв</p>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className={styles.textarea}
            />
          </div>
          <div className={styles.block}>
            <p>Оставьте рейтинг</p>
            <div className={styles.stars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={
                    (hoverRating || rating) >= star
                      ? styles.starFilled
                      : styles.star
                  }
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                >
                  ★
                </span>
              ))}
            </div>
          </div>
          <Button
            type="submit"
            className={styles.submitBtn}
            appearence="small"
            onClick={deleteMessage}
          >
            Отправить
          </Button>
        </form>
      </div>
    </div>
  );
};
