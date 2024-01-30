import React from "react";
import impressionIcon from "../../images/impressionIcon.png";
import styles from "./TrendingQuizBox.module.css";

function TrendingQuizBox({ quizName, impressions, createdAt }) {
  return (
    <div className={styles.trendingQuizBox}>
      <div className={styles.section1}>
        <p className={styles.quizName}>{quizName}</p>
        <p className={styles.impressionsColor}>
          {impressions}
          <img
            className={styles.impressionsIcon}
            src={impressionIcon}
            alt="impressionIcon"
          />
        </p>
      </div>

      <p className={styles.createdAt}>Created on : {createdAt}</p>
    </div>
  );
}

export default TrendingQuizBox;
