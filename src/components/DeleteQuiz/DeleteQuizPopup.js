import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./DeleteQuizPopup.module.css";
import styles1 from "../CommonStyles.module.css";
import ClipLoader from "react-spinners/ClipLoader";

function DeleteQuizPopup({ quizId, onClose }) {
  const token = localStorage.getItem("jwtToken");

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const [error, setError] = useState("");

  const userId = localStorage.getItem("userId");

  const baseUrl = localStorage.getItem("baseUrl");

  // Calling the Api to delete quiz

  const [loading, setLoading] = useState(true);

  const [confirmBtnClicked, setConfirmBtnClicked] = useState(false);

  const handleDeleteQuiz = () => {
    setConfirmBtnClicked(true);
    axios
      .delete(`${baseUrl}quizDeletion/${userId}/${quizId}`, {
        headers,
      })
      .then((response) => {
        onClose();
        toast.success("Quiz Deleted Successfully");
        setLoading(false);
      })
      .catch((error) => {
        if (
          error.response &&
          error.response.data &&
          error.response.data.error
        ) {
          setError(error.response.data.error);
        } else {
          setError("An error occurred while deleting quiz");
        }
        console.log(error);
        setLoading(false);
      });
  };

  const handleCancelBtn = () => {
    onClose();
  };

  return (
    <div className={styles.deleteBox}>
      <div className={styles.text}>
        <p>Are you confirm you</p>
        <p> want to delete ?</p>
      </div>

      <div className={styles.section2}>
        <button onClick={handleDeleteQuiz} className={styles.confirmBtn}>
          Confirm Delete
        </button>
        <button onClick={handleCancelBtn} className={styles.cancelBtn}>
          Cancel
        </button>
      </div>
      {error && <p className={styles1.error}>{error}</p>}

      {loading && confirmBtnClicked && (
        <div className={styles1.loaderContainer}>
          <div className={styles1.loaderBackground} />
          <ClipLoader color={"black"} loading={loading} />
        </div>
      )}
    </div>
  );
}

export default DeleteQuizPopup;
