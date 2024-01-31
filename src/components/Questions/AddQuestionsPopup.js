import React, { useEffect, useState } from "react";
import plusicon from "../../images/plusicon.png";
import smallcrossicon from "../../images/smallcrossicon.png";
import EachQuestion from "./EachQuestion";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./AddQuestions.module.css";
import styles1 from "../CommonStyles.module.css";

function AddQuestionsPopup({
  setIsAddQuestionsPopupOpen,
  setIsQuizPublishedPopupOpen,
  quizName,
  quizType,
  setEditableQuiz,
  editableQuiz,
  setNewlyCreatedQuizId,
}) {
  const [selectedQuestion, setSelectedQuestion] = useState(1);

  const [questions, setQuestions] = useState(() => {
    if (editableQuiz) {
      return Array.from(
        { length: editableQuiz.questionsArray.length },
        (_, index) => index + 1
      );
    } else {
      return [1];
    }
  });

  const [error, setError] = useState("");

  const [questionsArray, setQuestionsArray] = useState(() => {
    if (editableQuiz) {
      return editableQuiz.questionsArray.map((question, index) => ({
        ...question,
        questionNo: index + 1,
      }));
    } else {
      return [
        {
          questionNo: 1,
          question: "",
          optionType: "",
          optionValues: [],
          correctAnswer: "",
        },
      ];
    }
  });

  const [timer, setTimer] = useState(null);

  const handleTimerChange = (newTimer) => {
    setTimer(newTimer, () => {
      setNewQuiz((prevNewQuiz) => ({
        ...prevNewQuiz,
        timer: newTimer,
      }));
    });
  };

  const [newQuiz, setNewQuiz] = useState({
    name: quizName,
    type: quizType,
    timer: timer,
    impressions: 0,
    questionsArray,
  });

  const addQuestion = () => {
    const prevQuestion = questionsArray[questionsArray.length - 1];
    if (prevQuestion && !prevQuestion.question) {
      setError("Please enter the question");
      return;
    }

    if (prevQuestion && !prevQuestion.optionType) {
      setError("Please select the option type");
      return;
    }

    if (prevQuestion && prevQuestion.optionValues.length === 0) {
      setError("Please enter the options");
      return;
    }

    if (questions.length === 5) {
      setError("Maximum only 5 questions");
      return;
    }

    if (questions.length < 5) {
      const newQuestionNumber = questions.length + 1;

      const newQuestion = {
        questionNo: newQuestionNumber,
        question: "",
        optionType: "",
        optionValues: [],
        correctAnswer: "",
      };

      setQuestions([...questions, newQuestionNumber]);

      setQuestionsArray((prevQuestionsArray) => [
        ...prevQuestionsArray,
        newQuestion,
      ]);

      setSelectedQuestion(newQuestionNumber);

      setNewQuiz((prevNewQuiz) => ({
        ...prevNewQuiz,
        questionsArray: [...prevNewQuiz.questionsArray, newQuestion],
      }));

      setUpdatedQuiz((prevUpdatedQuiz) => ({
        ...prevUpdatedQuiz,
        questionsArray: [...prevUpdatedQuiz.questionsArray, newQuestion],
      }));
    }
  };

  const handleQuestionClick = (questionNumber) => {
    setSelectedQuestion(questionNumber);
  };

  const handleDeleteQuestion = (questionNumber) => {
    const remainingQuestions = questions.filter((q) => q !== questionNumber);

    setQuestions(remainingQuestions);
    const renumberedQuestions = remainingQuestions.map((_, index) => index + 1);

    setSelectedQuestion(
      renumberedQuestions.length > 0 ? renumberedQuestions[0] : 1
    );

    const updatedQuestionsArray = questionsArray.filter(
      (q) => q && q.questionNo !== questionNumber
    );
    setQuestionsArray(updatedQuestionsArray);

    setNewQuiz((prevNewQuiz) => ({
      ...prevNewQuiz,
      questionsArray: updatedQuestionsArray,
    }));

    setUpdatedQuiz((prevUpdatedQuiz) => ({
      ...prevUpdatedQuiz,
      questionsArray: updatedQuestionsArray,
    }));
  };

  const handleCancelBtn = () => {
    setEditableQuiz(null);
    setIsAddQuestionsPopupOpen(false);
  };

  useEffect(() => {
    setNewQuiz((prevNewQuiz) => ({
      ...prevNewQuiz,
      timer: timer,
      questionsArray: [...questionsArray],
    }));
  }, [timer, questionsArray]);

  const token = localStorage.getItem("jwtToken");

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const userId = localStorage.getItem("userId");

  const baseUrl = localStorage.getItem("baseUrl");

  const handleCreateQuizBtn = () => {
    axios
      .post(`${baseUrl}quizCreation/${userId}`, newQuiz, {
        headers,
      })
      .then((response) => {
        setError("");
        toast.success(response.data.message);
        setNewlyCreatedQuizId(response.data.id);
        setIsQuizPublishedPopupOpen(true);
        setIsAddQuestionsPopupOpen(false);
      })
      .catch((error) => {
        if (
          error.response &&
          error.response.data &&
          error.response.data.error
        ) {
          setError(error.response.data.error);
        } else {
          setError("An error occurred  while creating quiz");
        }
        console.log(error);
      });
  };

  const handleQuestionChange = (questionNumber, newQuestion) => {
    setQuestionsArray((prevQuestionsArray) => {
      const updatedQuestionsArray = [...prevQuestionsArray];
      const questionIndex = questionNumber - 1;
      updatedQuestionsArray[questionIndex] = newQuestion;
      return updatedQuestionsArray;
    });

    setNewQuiz((prevNewQuiz) => {
      const updatedQuestionsArray = [...prevNewQuiz.questionsArray];
      const questionIndex = questionNumber - 1;
      updatedQuestionsArray[questionIndex] = newQuestion;

      return {
        ...prevNewQuiz,
        questionsArray: updatedQuestionsArray,
      };
    });

    setUpdatedQuiz((prevUpdatedQuiz) => {
      const updatedQuestionsArray2 = [...prevUpdatedQuiz.questionsArray];
      const questionIndex2 = questionNumber - 1;
      updatedQuestionsArray2[questionIndex2] = newQuestion;

      return {
        ...prevUpdatedQuiz,
        questionsArray: updatedQuestionsArray2,
      };
    });
  };

  const [updatedQuiz, setUpdatedQuiz] = useState({
    questionsArray,
  });

  const quizId = editableQuiz ? editableQuiz._id : null;

  const handleUpdateQuizBtn = () => {
    axios
      .patch(`${baseUrl}quizUpdation/${userId}/${quizId}`, updatedQuiz, {
        headers,
      })
      .then((response) => {
        toast.success(response.data.message);
        setEditableQuiz(null);
        setIsAddQuestionsPopupOpen(false);
      })
      .catch((error) => {
        if (
          error.response &&
          error.response.data &&
          error.response.data.error
        ) {
          setError(error.response.data.error);
        } else {
          setError("An error occurred while updating quiz");
        }
        console.log(error);
      });
  };

  return (
    <div className={styles.addQuestionsPopup}>
      <div className={styles.section1}>
        {questions.map((questionNumber, index) => (
          <div key={questionNumber} className={styles.relativePosition}>
            <p
              onClick={() => handleQuestionClick(questionNumber)}
              style={{
                border:
                  selectedQuestion === questionNumber
                    ? "2px solid #60B84B"
                    : "",
              }}
              className={styles.questions}
            >
              {index + 1}
              {index !== 0 && (
                <img
                  onClick={() => handleDeleteQuestion(questionNumber)}
                  src={smallcrossicon}
                  alt="smallcrossicon"
                  className={styles.crossIcon}
                />
              )}
            </p>
            {index === questions.length - 1 && (
              <span>
                <img
                  style={{ cursor: "pointer" }}
                  onClick={addQuestion}
                  src={plusicon}
                  alt="plusicon"
                />
              </span>
            )}
          </div>
        ))}

        <div className={styles.section1RightSide}>
          <p className={styles.section1Text}>Max 5 questions</p>
        </div>
      </div>

      {/* EachQuestion component */}

      {questions.map((questionNumber) => (
        <div key={questionNumber}>
          <EachQuestion
            questionNumber={questionNumber}
            selected={selectedQuestion === questionNumber}
            questionsArray={questionsArray.find(
              (q) => q.questionNo === questionNumber
            )}
            onQuestionChange={(newQuestion) =>
              handleQuestionChange(questionNumber, newQuestion)
            }
            onTimerChange={handleTimerChange}
            quizType={quizType}
            editableQuiz={editableQuiz}
          />
        </div>
      ))}

      {error && (
        <div className={styles.error}>
          <p className={styles1.error}>{error}</p>
        </div>
      )}

      <div className={styles.btnSection}>
        <button onClick={handleCancelBtn} className={styles.cancelBtn}>
          Cancel
        </button>
        {editableQuiz === null ? (
          <button
            onClick={handleCreateQuizBtn}
            className={styles.createOrUpdateBtn}
          >
            Create Quiz
          </button>
        ) : (
          <button
            onClick={handleUpdateQuizBtn}
            className={styles.createOrUpdateBtn}
          >
            Update Quiz
          </button>
        )}
      </div>
    </div>
  );
}

export default AddQuestionsPopup;
