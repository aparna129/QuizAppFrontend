import React from "react";
import styles from "./CreateAndEdit.module.css";

function EditQuizPopup({
  editableQuizName,
  editableQuizType,
  setIsEditQuizPopupOpen,
  setIsAddQuestionsPopupOpen,
  setEditableQuiz,
}) {
  const handleCancelBtn = () => {
    setEditableQuiz(null);
    setIsEditQuizPopupOpen(false);
  };

  const handleContinueBtn = () => {
    setIsAddQuestionsPopupOpen(true);
    setIsEditQuizPopupOpen(false);
  };

  return (
    <div className={styles.popupBox}>
      <input
        className={styles.input}
        type="text"
        placeholder="Quiz name"
        value={editableQuizName}
      ></input>

      <div className={styles.section2}>
        <p className={styles.quizType}>Quiz Type</p>
        <button
          style={{
            color: editableQuizType === "QnA" ? "#FFFFFF" : "#9F9F9F",
            backgroundColor: editableQuizType === "QnA" ? "#60B84B" : "#FFFFFF",
          }}
          className={styles.qnaTypeBtn}
        >
          Q & A
        </button>
        <button
          style={{
            color: editableQuizType === "Poll Type" ? "#FFFFFF" : "#9F9F9F",
            backgroundColor:
              editableQuizType === "Poll Type" ? "#60B84B" : "#FFFFFF",
          }}
          className={styles.pollTypeBtn}
        >
          Poll Type
        </button>
      </div>

      <div className={styles.section3}>
        <button onClick={handleCancelBtn} className={styles.cancelBtn}>
          Cancel
        </button>
        <button onClick={handleContinueBtn} className={styles.continueBtn}>
          Continue
        </button>
      </div>
    </div>
  );
}

export default EditQuizPopup;
