import React from "react";
import styles from "./QnAQuestionsAnalysis.module.css";

function QnAQuestion({
  question,
  correctAnswers,
  incorrectAnswers,
  questionNumber,
}) {
  return (
    <div className={styles.questionSection1}>
      <p className={styles.questionNo}>
        Q.{questionNumber} {question}
      </p>

      <div className={styles.questionSection2}>
        <div className={styles.textInBox}>
          <p className={styles.numbers}>{correctAnswers + incorrectAnswers}</p>
          <p className={styles.peopleText}>People Attempted the question</p>
        </div>

        <div className={styles.textInBox}>
          <p className={styles.numbers}>{correctAnswers}</p>
          <p className={styles.peopleText}>People Answered Correctly</p>
        </div>

        <div className={styles.textInBox}>
          <p className={styles.numbers}>{incorrectAnswers}</p>
          <p className={styles.peopleText}>People Answered Incorrectly</p>
        </div>
      </div>
    </div>
  );
}

export default QnAQuestion;
