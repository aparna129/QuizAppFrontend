import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import CompletedQuiz from "./CompletedQuiz";
import styles from "./LiveQuizInterface.module.css";
import styles1 from "../CommonStyles.module.css";
import ClipLoader from "react-spinners/ClipLoader";

function LiveQuizInterface() {
  const { quizId } = useParams();

  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [timer, setTimer] = useState(null);
  const [timerActive, setTimerActive] = useState(false);

  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);

  const [impressions, setImpressions] = useState(0);

  const baseUrl = localStorage.getItem("baseUrl");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${baseUrl}getQuizById/${quizId}`)
      .then((response) => {
        const { quiz } = response.data;
        setQuiz(quiz);
        setImpressions(quiz.impressions);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
    // eslint-disable-next-line
  }, [quizId]);

  //Impressions Updation
  useEffect(() => {
    setImpressions((prevImpressions) => prevImpressions + 1);
    axios
      .patch(`${baseUrl}impressionsUpdation/${quizId}`, {
        impressions: impressions + 1,
      })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
    // eslint-disable-next-line
  }, []);

  const handleNextOrSubmitQna = () => {
    // Check if the quiz is already completed, if so, return
    if (quizCompleted) {
      return;
    }

    let peopleAnsweredCorrectly = 0;
    let peopleAnsweredIncorrectly = 0;

    // If there are more questions to go through
    if (currentQuestionIndex < quiz.questionsArray.length - 1) {
      const currentQuestion = quiz.questionsArray[currentQuestionIndex];

      // If an option is selected for the current question
      if (selectedOptionIndex !== null) {
        // Check if the selected option is correct
        if (currentQuestion.correctAnswer === selectedOptionIndex + 1) {
          // If the timer is not active, increment the correct answer count
          if (!timerActive) {
            setCorrectAnswersCount((prevCount) => prevCount + 1);
            peopleAnsweredCorrectly = 1;
          } else {
            peopleAnsweredIncorrectly = 1;
          }
        } else {
          // If the selected option is incorrect, mark as incorrectly answered
          peopleAnsweredIncorrectly = 1;
        }
      } else {
        // If no option is selected, mark as incorrectly answered
        peopleAnsweredIncorrectly = 1;
      }

      // Move to the next question
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    } else {
      // If it's the last question
      if (selectedOptionIndex !== null) {
        const currentQuestion = quiz.questionsArray[currentQuestionIndex];
        // Check if the selected option is correct
        if (currentQuestion.correctAnswer === selectedOptionIndex + 1) {
          // If the timer is not active, increment the correct answer count
          if (!timerActive) {
            setCorrectAnswersCount((prevCount) => prevCount + 1);
            peopleAnsweredCorrectly = 1;
          } else {
            peopleAnsweredIncorrectly = 1;
          }
        } else {
          // If the selected option is incorrect, mark as incorrectly answered
          peopleAnsweredIncorrectly = 1;
        }
      } else {
        // If no option is selected, mark as incorrectly answered
        peopleAnsweredIncorrectly = 1;
      }

      // Set quiz as completed
      setQuizCompleted(true);
    }

    // Reset selected option index
    setSelectedOptionIndex(null);

    // Send axios patch request to update question data
    axios
      .patch(
        `${baseUrl}questionsUpdation/${quiz._id}/${quiz.questionsArray[currentQuestionIndex]._id}`,
        {
          peopleAnsweredCorrectly,
          peopleAnsweredIncorrectly,
        }
      )
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        if (
          error.response &&
          error.response.data &&
          error.response.data.error
        ) {
          console.log(error);
        }
      });
  };

  const handleNextOrSubmitPoll = () => {
    if (quizCompleted) {
      return;
    }
    let peopleAnsweredOption1 = 0;
    let peopleAnsweredOption2 = 0;
    let peopleAnsweredOption3 = 0;
    let peopleAnsweredOption4 = 0;
    if (selectedOptionIndex === 0) {
      peopleAnsweredOption1 = 1;
    }
    if (selectedOptionIndex === 1) {
      peopleAnsweredOption2 = 1;
    }
    if (selectedOptionIndex === 2) {
      peopleAnsweredOption3 = 1;
    }
    if (selectedOptionIndex === 3) {
      peopleAnsweredOption4 = 1;
    }
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);

    const baseUrl = localStorage.getItem("baseUrl");

    axios
      .patch(
        `${baseUrl}questionsUpdation/${quiz._id}/${quiz.questionsArray[currentQuestionIndex]._id}`,
        {
          peopleAnsweredOption1,
          peopleAnsweredOption2,
          peopleAnsweredOption3,
          peopleAnsweredOption4,
        }
      )
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        if (
          error.response &&
          error.response.data &&
          error.response.data.error
        ) {
          console.log(error);
        }
      });
    setSelectedOptionIndex(null);
    // If its last question
    if (currentQuestionIndex === quiz.questionsArray.length - 1) {
      setQuizCompleted(true);
    }
  };

  useEffect(() => {
    // Set up a timer interval
    // setInterval: This function sets up a recurring timer interval. It takes a
    // callback function and a duration in milliseconds.
    const timerInterval = setInterval(() => {
      // Update the timer state
      setTimer((prevTimer) => {
        if (prevTimer > 0) {
          // If the timer is greater than 0, decrement it by 1
          return prevTimer - 1;
        } else {
          // If the timer reaches 0, set the timer active state to true
          setTimerActive(true);
          // Call handleNextOrSubmitQna function to move to the next question or submit the quiz
          handleNextOrSubmitQna();
          return 0;
        }
      });
    }, 1000); // Update the timer every second

    // Clean up function
    return () => {
      // Clear the timer interval
      clearInterval(timerInterval);
      // Set the timer active state to false
      setTimerActive(false);
    };
    // This ensures that the effect runs when any of these values change
    // eslint-disable-next-line
  }, [timer, currentQuestionIndex, quizCompleted]);

  useEffect(() => {
    if (quiz && quiz.questionsArray && quiz.questionsArray.length > 0) {
      setTimer(
        quiz.timer === "5 sec"
          ? 5
          : quiz.timer === "10 sec"
          ? 10
          : quiz.timer === "OFF" || quiz.type === "Poll Type"
          ? Infinity
          : 0
      );
    }
  }, [currentQuestionIndex, quiz]);

  const handleOptionSelect = (index) => {
    setSelectedOptionIndex(index);
  };

  if (quizCompleted) {
    return (
      <CompletedQuiz
        type={quiz.type}
        correctAnswer={correctAnswersCount}
        totalQuestions={quiz.questionsArray.length}
      />
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        {quiz && quiz.questionsArray && quiz.questionsArray.length > 0 && (
          <div>
            <div className={styles.section1}>
              <p className={styles.questionNo}>
                0{currentQuestionIndex + 1}/0{quiz.questionsArray.length}
              </p>

              {quiz.timer !== "OFF" && quiz.type !== "Poll Type" && (
                <p className={styles.timer}>
                  00:{timer < 10 ? `0${timer}` : timer}s
                </p>
              )}
            </div>

            <div className={styles.section2}>
              <p className={styles.question}>
                {quiz.questionsArray[currentQuestionIndex].question}
              </p>
            </div>

            <div className={styles.section3}>
              {quiz.questionsArray[currentQuestionIndex].optionValues.map(
                (option, index) => (
                  <div
                    onClick={() => handleOptionSelect(index)}
                    style={{
                      border:
                        selectedOptionIndex === index
                          ? "4px solid #5076FF"
                          : "",
                    }}
                    className={
                      quiz.questionsArray[currentQuestionIndex].optionType ===
                      "Text"
                        ? styles.optionBoxText
                        : quiz.questionsArray[currentQuestionIndex]
                            .optionType === "ImageUrl"
                        ? styles.optionTypeImage
                        : quiz.questionsArray[currentQuestionIndex]
                            .optionType === "TextAndImageUrl"
                        ? styles.optionTextAndImage
                        : ""
                    }
                  >
                    {quiz.questionsArray[currentQuestionIndex].optionType ===
                      "Text" && (
                      <p className={styles.textType}> {option.value}</p>
                    )}

                    {quiz.questionsArray[currentQuestionIndex].optionType ===
                      "ImageUrl" && (
                      <img
                        className={styles.imageType}
                        src={option.imageUrl}
                        alt="optionImage"
                      />
                    )}

                    {quiz.questionsArray[currentQuestionIndex].optionType ===
                      "TextAndImageUrl" && (
                      <div className={styles.thirdType}>
                        <p className={styles.thirdTypeText}>{option.value}</p>
                        <img
                          className={styles.thirdTypeImage}
                          src={option.imageUrl}
                          alt="optionImage"
                        />
                      </div>
                    )}
                  </div>
                )
              )}
            </div>

            <div className={styles.section4}>
              <button
                onClick={() => {
                  if (quiz.type === "Poll Type") {
                    handleNextOrSubmitPoll();
                  } else {
                    handleNextOrSubmitQna();
                  }
                }}
                className={styles.nextBtn}
              >
                {currentQuestionIndex < quiz.questionsArray.length - 1
                  ? "NEXT"
                  : "SUBMIT"}
              </button>
            </div>
          </div>
        )}
      </div>

      {loading && (
        <div className={styles1.loaderContainer}>
          <div className={styles1.loaderBackground} />
          <ClipLoader color={"black"} loading={loading} />
        </div>
      )}
    </div>
  );
}

export default LiveQuizInterface;
