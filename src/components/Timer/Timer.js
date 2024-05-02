import React, { useState } from "react";
import styles from "./Timer.module.css";

function Timer({ onTimerChange }) {
  const [selectedTimer, setSelectedTimer] = useState("");

  // Handling timer when any of the button is clicked 

  const handleTimerOff = () => {
    setSelectedTimer(null);
    onTimerChange("OFF");
  };

  const handleTimer5sec = () => {
    setSelectedTimer(5);
    onTimerChange("5 sec");
  };

  const handleTimer10sec = () => {
    setSelectedTimer(10);
    onTimerChange("10 sec");
  };

  return (
    <div className={styles.section1}>
      <p className={styles.timer}> Timer</p>
      <p>
        <button
          onClick={handleTimerOff}
          style={{
            color: selectedTimer === null ? "#FFFFFF" : "#9F9F9F",
            background: selectedTimer === null ? "#D60000" : "none",
          }}
          className={styles.timerBtns}
        >
          OFF
        </button>
      </p>
      <p>
        <button
          onClick={handleTimer5sec}
          style={{
            color: selectedTimer === 5 ? "#FFFFFF" : "#9F9F9F",
            background: selectedTimer === 5 ? "#D60000" : "none",
          }}
          className={styles.timerBtns}
        >
          5 sec
        </button>
      </p>
      <p>
        <button
          onClick={handleTimer10sec}
          style={{
            color: selectedTimer === 10 ? "#FFFFFF" : "#9F9F9F",
            background: selectedTimer === 10 ? "#D60000" : "none",
          }}
          className={styles.timerBtns}
        >
          10 sec
        </button>
      </p>
    </div>
  );
}

export default Timer;
