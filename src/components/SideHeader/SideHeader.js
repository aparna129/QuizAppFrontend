import React, { useState } from "react";
import line from "../../images/line.png";
import { useNavigate } from "react-router-dom";
import styles from "./SideHeader.module.css";

function SideHeader({ option, setIsCreateQuizPopupOpen }) {
  const [isCreateQuizClicked, setIsCreateQuizClicked] = useState(false);

  const handleCreateQuiz = () => {
    setIsCreateQuizClicked(true);
    setIsCreateQuizPopupOpen(true);
  };

  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  const handleDashboardClicked = () => {
    setIsCreateQuizClicked(false);
    navigate("/dashboard");
  };

  const handleAnalyticsClicked = () => {
    setIsCreateQuizClicked(false);
    navigate("/analytics");
  };

  return (
    <div className={styles.container}>
      <div className={styles.section1}>
        <p className={styles.header}>QUIZZIE</p>
        <div>
          <p
            onClick={handleDashboardClicked}
            style={{
              boxShadow:
                option === "dashboard" && !isCreateQuizClicked
                  ? "0px 0px 14px 0px #0000001F"
                  : "",
            }}
            className={styles.btns}
          >
            Dashboard
          </p>
          <p
            onClick={handleAnalyticsClicked}
            style={{
              boxShadow:
                option === "analytics" && !isCreateQuizClicked
                  ? "0px 0px 14px 0px #0000001F"
                  : "",
            }}
            className={styles.btns}
          >
            Analytics
          </p>
          <p
            onClick={handleCreateQuiz}
            style={{
              boxShadow: isCreateQuizClicked
                ? "0px 0px 14px 0px #0000001F"
                : "",
            }}
            className={styles.btns}
          >
            Create Quiz
          </p>
        </div>
        <p className={styles.section2}>
          <img src={line} alt="line" />
        </p>
        <p onClick={handleLogout} className={styles.logout}>
          Logout
        </p>
      </div>
    </div>
  );
}

export default SideHeader;
