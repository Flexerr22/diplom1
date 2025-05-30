import { useEffect, useState } from "react";
import { ModalTypeAccept } from "../AcceptProject/AcceptProject";
import styles from "./Rating.module.css";
import Button from "../Button/Button";
import { ThumbsUp } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface RatingProps {
  setActiveModal: (value: ModalTypeAccept) => void;
  sender?: number;
  project_id?: number;
}

export const Rating = ({ setActiveModal, sender, project_id }: RatingProps) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleClickOutside = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setActiveModal(null);
    }
  };

  useEffect(() => {
  }, []);


  const postRating = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!rating) {
      setError("Пожалуйста, поставьте оценку");
      return;
    }

    if (!reviewText.trim()) {
      setError("Пожалуйста, напишите отзыв");
      return;
    }

    if (!sender) {
      setError("Не удалось определить получателя оценки");
      return;
    }

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
      console.log(reviewData)
      if (project_id) { // Добавляем проверку
        await deleteProject();
      }
      navigate("/");
    } catch (error) {
      console.error("Произошла ошибка", error);
      setError("Не удалось отправить отзыв. Попробуйте позже.");
    }
  };

  const deleteProject = async () => {
    if (!sender || !project_id) return;
    const jwt = Cookies.get("jwt");
    if (!jwt) return;
    try{
      const decoded = jwtDecode<{ sub: string }>(jwt);
      const user_id = parseInt(decoded.sub, 10);

      try {
        // Пробуем удалить вариант где текущий пользователь - sender
        await axios.delete('http://127.0.0.1:8000/project-members/', {
          params: {
            sender_id: user_id,
            recipient_id: sender,
            project_id: project_id
          }
        });
      } catch  {
        // Если не нашли, пробуем вариант где текущий пользователь - recipient
        await axios.delete('http://127.0.0.1:8000/project-members/', {
          params: {
            sender_id: sender,
            recipient_id: user_id,
            project_id: project_id
          }
        });
      }
    } catch(error) {
      console.error(error)
    }
  }

  const validateInput = (value: string): boolean => {
    const regex = /^[a-zA-Zа-яА-Я0-9\s.,:%!?()@_-]*$/;
    if (!regex.test(value)) {
      setError(
        "Недопустимые символы. Разрешены только буквы, цифры, пробелы и @_."
      );
      return false;
    }

    if (/\s{2,}/.test(value)) {
      setError("Нельзя вводить более одного пробела подряд.");
      return false;
    }

    setError(null);
    return true;
  };

  const handleReviewChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;

    if (!validateInput(value)) {
      return;
    }

    setReviewText(value.replace(/\s+/g, " "));
  };

  return (
    <div className={styles.modal_main} onClick={handleClickOutside}>
      <div className={styles.modal_secondary}>
        <div className={styles.header}>
          <p>Оцените сотрудничество</p>
        </div>
        <ThumbsUp size={50} />
        <form onSubmit={postRating} className={styles.form}>
          {error && <div className={styles.error}>{error}</div>}
          <div className={styles.block}>
            <p>Оставьте отзыв</p>
            <textarea
              value={reviewText}
              onChange={handleReviewChange}
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
          <Button type="submit" className={styles.submitBtn} appearence="small">
            Отправить
          </Button>
        </form>
      </div>
    </div>
  );
};
