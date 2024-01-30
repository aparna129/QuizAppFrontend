import React, { useState } from "react";
import styles from "./CreateAndEdit.module.css";
import styles1 from "../CommonStyles.module.css";

function CreateQuizPopup({
  setIsCreateQuizPopupOpen,
  setIsAddQuestionsPopupOpen,
  setQuizName,
  setQuizType,
}) {
  const handleCancelBtn = () => {
    setIsCreateQuizPopupOpen(false);
  };

  const [isQnAClicked, setIsQnAClicked] = useState(false);
  const [isPollTypeClicked, setIsPollTypeClicked] = useState(false);

  const [error, setError] = useState(false);

  const handleQnABtn = () => {
    setIsQnAClicked(true);
    setIsPollTypeClicked(false);
    setQuizType("QnA");
  };

  const handlePollTypeBtn = () => {
    setIsPollTypeClicked(true);
    setIsQnAClicked(false);
    setQuizType("Poll Type");
  };

  const [quizName, setquizname] = useState("");

  const handleContinueClicked = () => {
    if (quizName.trim() === "") {
      setError("Quiz name cannot be empty");
    } else if (!isQnAClicked && !isPollTypeClicked) {
      setError("Select a quiz type");
    } else {
      setError("");
      setQuizName(quizName);
      setIsAddQuestionsPopupOpen(true);
      setIsCreateQuizPopupOpen(false);
    }
  };

  return (
    <div className={styles.popupBox}>
      <input
        className={styles.input}
        type="text"
        placeholder="Quiz name "
        value={quizName}
        onChange={(e) => setquizname(e.target.value)}
      ></input>

      <div className={styles.section2}>
        <p className={styles.quizType}>Quiz Type</p>
        <button
          onClick={handleQnABtn}
          style={{
            color: isQnAClicked ? "#FFFFFF" : "#9F9F9F",
            backgroundColor: isQnAClicked ? "#60B84B" : "#FFFFFF",
          }}
          className={styles.qnaTypeBtn}
        >
          Q & A
        </button>
        <button
          onClick={handlePollTypeBtn}
          style={{
            color: isPollTypeClicked ? "#FFFFFF" : "#9F9F9F",
            backgroundColor: isPollTypeClicked ? "#60B84B" : "#FFFFFF",
          }}
          className={styles.pollTypeBtn}
        >
          Poll Type
        </button>
      </div>

      {error && <p className={styles1.error}>{error}</p>}

      <div className={styles.section3}>
        <button onClick={handleCancelBtn} className={styles.cancelBtn}>
          Cancel
        </button>
        <button onClick={handleContinueClicked} className={styles.continueBtn}>
          Continue
        </button>
      </div>
    </div>
  );
}

export default CreateQuizPopup;
