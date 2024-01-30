import React from "react";
import styles from "./PollQuestionAnalysis.module.css";

function PollQuestion({
  question,
  option1,
  option2,
  option3,
  option4,
  questionNumber,
}) {
  return (
    <div className={styles.pollQuestionsSection1}>
      <p className={styles.questionNo}>
        Q.{questionNumber} {question} ?
      </p>

      <div className={styles.pollQuestionsSection2}>
        <div className={styles.pollQuestionsBox}>
          <p className={styles.number}>
            {option1}
            <span className={styles.options}>Option 1</span>
          </p>
        </div>

        <div className={styles.pollQuestionsBox}>
          <p className={styles.number}>
            {option2}
            <span className={styles.options}>Option 2</span>
          </p>
        </div>

        <div className={styles.pollQuestionsBox}>
          <p className={styles.number}>
            {option3}
            <span className={styles.options}>Option 3</span>
          </p>
        </div>
        <div className={styles.pollQuestionsBox}>
          <p className={styles.number}>
            {option4}
            <span className={styles.options}>Option 4</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default PollQuestion;
