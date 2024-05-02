import React, { useEffect, useState } from "react";
import plusicon from "../../images/plusicon.png";
import smallcrossicon from "../../images/smallcrossicon.png";
import EachQuestion from "./EachQuestion";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./AddQuestions.module.css";
import styles1 from "../CommonStyles.module.css";
import ClipLoader from "react-spinners/ClipLoader";

function AddQuestionsPopup({
  setIsAddQuestionsPopupOpen,
  setIsQuizPublishedPopupOpen,
  quizName,
  quizType,
  setEditableQuiz,
  editableQuiz,
  setNewlyCreatedQuizId,
}) {
  // By default there will be 1st question
  const [selectedQuestion, setSelectedQuestion] = useState(1);

  const [questions, setQuestions] = useState(() => {
    if (editableQuiz) {
      // Create an array with a length equal to the number of questions in the 'editableQuiz'
      // Array.from() creates a new, shallow-copied Array instance from an array-like or iterable object.
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
    // Check if `editableQuiz` exists
    if (editableQuiz) {
      // If `editableQuiz`exists initialize `questionsArray` to editableQuiz questionsArray
      return editableQuiz.questionsArray.map((question, index) => ({
        ...question,
        questionNo: index + 1,
      }));
    } else {
      // If `editableQuiz` doesnt exist initialize `questionsArray` state with an array containing a single default question
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

  // Updating the Timer
  const handleTimerChange = (newTimer) => {
    setTimer(newTimer, () => {
      setNewQuiz((prevNewQuiz) => ({
        ...prevNewQuiz,
        timer: newTimer,
      }));
    });
  };

  // Creating Quiz
  const [newQuiz, setNewQuiz] = useState({
    name: quizName,
    type: quizType,
    timer: timer,
    impressions: 0,
    questionsArray,
  });

  const addQuestion = () => {
    // Checking whether previous question is valid or not
    const prevQuestion = questionsArray[questionsArray.length - 1];
    if (prevQuestion && !prevQuestion.question) {
      toast.error("Please enter the question");
      return;
    }

    if (prevQuestion && !prevQuestion.optionType) {
      toast.error("Please select the option type");
      return;
    }

    if (prevQuestion && prevQuestion.optionValues.length === 0) {
      toast.error("Please enter the options");
      return;
    }

    const newQuestionNumber = questions.length + 1;

    // Creating a new question
    const newQuestion = {
      questionNo: newQuestionNumber,
      question: "",
      optionType: "",
      optionValues: [],
      correctAnswer: "",
    };

    // Adding current questionNo to questions Array
    setQuestions([...questions, newQuestionNumber]);

    // Adding whole current question to questionsArray Array
    setQuestionsArray((prevQuestionsArray) => [
      ...prevQuestionsArray,
      newQuestion,
    ]);

    // Set selected question as current question
    setSelectedQuestion(newQuestionNumber);

    // Adding this new question in NewQuiz also
    setNewQuiz((prevNewQuiz) => ({
      ...prevNewQuiz,
      questionsArray: [...prevNewQuiz.questionsArray, newQuestion],
    }));

    // Adding this new question in UpdatedQuiz also
    setUpdatedQuiz((prevUpdatedQuiz) => ({
      ...prevUpdatedQuiz,
      questionsArray: [...prevUpdatedQuiz.questionsArray, newQuestion],
    }));
  };

  // When any question is clicked set selected question as the clicked question
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

    // Removing the question from questionsArray where questionNo is questionNumber
    const updatedQuestionsArray = questionsArray.filter(
      (q) => q && q.questionNo !== questionNumber
    );
    setQuestionsArray(updatedQuestionsArray);

    // Removing question in NewQuiz also
    setNewQuiz((prevNewQuiz) => ({
      ...prevNewQuiz,
      questionsArray: updatedQuestionsArray,
    }));

    // Removing question in UpdatedQuiz also
    setUpdatedQuiz((prevUpdatedQuiz) => ({
      ...prevUpdatedQuiz,
      questionsArray: updatedQuestionsArray,
    }));
  };

  const handleCancelBtn = () => {
    setEditableQuiz(null);
    setIsAddQuestionsPopupOpen(false);
  };

  // Updating NewQuiz whenever timer or questionsArray is changing
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

  const [loading, setLoading] = useState(true);

  const [createBtnClicked,setCreateBtnClicked]=useState(false);

  // Create Quiz Api
  const handleCreateQuizBtn = () => {
    setCreateBtnClicked(true);
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
          setError("An error occurred  while creating quiz");
        }
        console.log(error);
        setLoading(false);
      });
  };

  const handleQuestionChange = (questionNumber, newQuestion) => {
    // Update the questionsArray state with the new question
    setQuestionsArray((prevQuestionsArray) => {
      const updatedQuestionsArray = [...prevQuestionsArray];
      const questionIndex = questionNumber - 1; // Adjust index to 0-based
      updatedQuestionsArray[questionIndex] = newQuestion;
      return updatedQuestionsArray;
    });

    // Update the newQuiz state with the new question
    setNewQuiz((prevNewQuiz) => {
      const updatedQuestionsArray = [...prevNewQuiz.questionsArray];
      const questionIndex = questionNumber - 1; // Adjust index to 0-based
      updatedQuestionsArray[questionIndex] = newQuestion;

      return {
        ...prevNewQuiz,
        questionsArray: updatedQuestionsArray,
      };
    });

    // Update the updatedQuiz state with the new question
    setUpdatedQuiz((prevUpdatedQuiz) => {
      const updatedQuestionsArray2 = [...prevUpdatedQuiz.questionsArray];
      const questionIndex2 = questionNumber - 1; // Adjust index to 0-based
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

  const [updateBtnClicked,setUpdateBtnClicked]=useState(false);

  // Update Quiz Api
  const handleUpdateQuizBtn = () => {
    setUpdateBtnClicked(true);
    axios
      .patch(`${baseUrl}quizUpdation/${userId}/${quizId}`, updatedQuiz, {
        headers,
      })
      .then((response) => {
        toast.success(response.data.message);
        setEditableQuiz(null);
        setIsAddQuestionsPopupOpen(false);
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
          setError("An error occurred while updating quiz");
        }
        console.log(error);
        setLoading(false);
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
            {/* plus icon is displayed only after last question */}
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
      </div>

      {/* EachQuestion component */}

      {questions.map((questionNumber) => (
        // Iterating over each question in the 'questions' array
        <div key={questionNumber}>
          {/* Rendering a div for each question */}
          <EachQuestion
            // Passing questionNumber as a prop to EachQuestion component
            questionNumber={questionNumber}
            // Passing 'selected' prop to EachQuestion, indicating if it's selected
            selected={selectedQuestion === questionNumber}
            // Finding the question object in questionsArray matching the questionNumber
            questionsArray={questionsArray.find(
              (q) => q.questionNo === questionNumber
            )}
            // Passing a callback to handle question changes
            onQuestionChange={(newQuestion) =>
              handleQuestionChange(questionNumber, newQuestion)
            }
            // Passing a function to handle timer changes
            onTimerChange={handleTimerChange}
            // Passing the quizType prop to EachQuestion
            quizType={quizType}
            // Passing the editableQuiz prop to EachQuestion
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

      {loading && (createBtnClicked||updateBtnClicked) && (
        <div className={styles1.loaderContainer}>
          <div className={styles1.loaderBackground} />
          <ClipLoader color={"black"} loading={loading} />
        </div>
      )}
    </div>
  );
}

export default AddQuestionsPopup;
