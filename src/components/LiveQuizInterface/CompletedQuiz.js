import React from "react";
import trophyimage from "../../images/trophyimage.png";
import styles from "./CompletedQuiz.module.css";

function CompletedQuiz({ type, correctAnswer, totalQuestions }) {
  if (type === "QnA") {
    return (
      <div className={styles.container}>
        <div className={styles.container2}>
          <p className={styles.qnaText}>Congrats Quiz is completed</p>

          <p>
            <img
              className={styles.trophyimage}
              src={trophyimage}
              alt="trophyimage"
            />
          </p>

          <p className={styles.scoreText}>
            Your Score is{" "}
            <span className={styles.score}>
              0{correctAnswer}/0{totalQuestions}
            </span>
          </p>
        </div>
      </div>
    );
  } else {
    return (
      <div className={styles.container}>
        <div className={styles.container2}>
          <p className={styles.pollText}>
            <p>Thank you</p> <p>for participating in </p>
            <p>the Poll</p>
          </p>
        </div>
      </div>
    );
  }
}

export default CompletedQuiz;
