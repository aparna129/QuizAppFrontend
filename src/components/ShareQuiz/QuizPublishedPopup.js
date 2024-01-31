import React from "react";
import crossicon from "../../images/crossicon.png";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./QuizPublishedPopup.module.css";

function QuizPublishedPopup({
  setIsQuizPublishedPopupOpen,
  newlyCreatedQuizId,
}) {
  const handleCross = () => {
    setIsQuizPublishedPopupOpen(false);
  };

  const message = `Your link is here :https://quizzie-universe-app.netlify.app/quiz/${newlyCreatedQuizId}`;

  const handleShareBtn = () => {
    const link = `https://quizzie-universe-app.netlify.app/quiz/${newlyCreatedQuizId}`;
    navigator.clipboard.writeText(link).then(() => {
      toast.success("Link copied to Clipboard");
    });
  };

  return (
    <div className={styles.shareBox}>
      <div className={styles.cross}>
        <img
          onClick={handleCross}
          className={styles.crossIcon}
          src={crossicon}
          alt="crossicon"
        />
      </div>

      <div className={styles.text}>
        <p>Congrats your Quiz is </p>
        <p>Published!</p>
      </div>

      <div>
        <input className={styles.input} value={message}></input>
      </div>

      <div className={styles.section2}>
        <button onClick={handleShareBtn} className={styles.shareBtn}>
          Share
        </button>
      </div>
    </div>
  );
}

export default QuizPublishedPopup;
