import React, { useState, useEffect } from "react";
import PollQuestion from "./PollQuestion";
import line2 from "../../images/line2.png";
import SideHeader from "../SideHeader/SideHeader";
import { useParams } from "react-router-dom";
import axios from "axios";
import CreateQuizPopup from "../CreateAndEditQuiz/CreateQuizPopup";
import AddQuestionsPopup from "../Questions/AddQuestionsPopup";
import QuizPublishedPopup from "../ShareQuiz/QuizPublishedPopup";
import styles1 from "../CommonStyles.module.css";
import styles from "./PollQuestionAnalysis.module.css";

function PollQuestionAnalysis() {
  const { quizId } = useParams();

  const [quiz, setQuiz] = useState();

  const [isCreateQuizPopupOpen, setIsCreateQuizPopupOpen] = useState(false);
  const [isAddQuestionsPopupOpen, setIsAddQuestionsPopupOpen] = useState(false);
  const [isQuizPublishedPopupOpen, setIsQuizPublishedPopupOpen] =
    useState(false);

  const [editableQuiz, setEditableQuiz] = useState(null);

  const [newlyCreatedQuizId, setNewlyCreatedQuizId] = useState("");

  const baseUrl = localStorage.getItem("baseUrl");

  useEffect(() => {
    axios
      .get(`${baseUrl}getQuizById/${quizId}`)
      .then((response) => {
        const { quiz } = response.data;
        setQuiz(quiz);
      })
      .catch((error) => {
        console.log(error);
      });
    // eslint-disable-next-line
  }, [quizId]);

  const [quizName, setQuizName] = useState("");
  const [quizType, setQuizType] = useState("");

  return (
    <div className={styles1.screen}>
      <div className={styles1.sideheader}>
        <SideHeader
          option="analytics"
          setIsCreateQuizPopupOpen={setIsCreateQuizPopupOpen}
        />
      </div>

      <div className={styles1.background}>
        <div className={styles.section1}>
          <div>
            <p className={styles.question}>
              {quiz && quiz.name ? `${quiz.name} Question Analysis` : ""}
            </p>
          </div>
          <div className={styles.createdAndImpressions}>
            {quiz ? (
              <div>
                <p>Created on : {quiz.createdAt}</p>
                <p>Impressions : {quiz.impressions}</p>
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
        <div className={styles.section2}>
          <div className={styles.pollQuestions}>
            {quiz &&
              quiz.questionsArray.map((question, index) => (
                <div>
                  <PollQuestion
                    question={question.question}
                    option1={question.peopleAnsweredOption1}
                    option2={question.peopleAnsweredOption2}
                    option3={question.peopleAnsweredOption3}
                    option4={question.peopleAnsweredOption4}
                    questionNumber={++index}
                  />

                  <img className={styles.lineImg} src={line2} alt="line2" />
                </div>
              ))}
          </div>
        </div>
      </div>
      {isCreateQuizPopupOpen && (
        <div className={styles1.popup}>
          <CreateQuizPopup
            setIsCreateQuizPopupOpen={setIsCreateQuizPopupOpen}
            setIsAddQuestionsPopupOpen={setIsAddQuestionsPopupOpen}
            setQuizName={setQuizName}
            setQuizType={setQuizType}
          />
        </div>
      )}
      {isAddQuestionsPopupOpen && (
        <div className={styles1.popup}>
          <AddQuestionsPopup
            setIsAddQuestionsPopupOpen={setIsAddQuestionsPopupOpen}
            setIsQuizPublishedPopupOpen={setIsQuizPublishedPopupOpen}
            quizName={quizName}
            quizType={quizType}
            editableQuiz={editableQuiz}
            setEditableQuiz={setEditableQuiz}
            setNewlyCreatedQuizId={setNewlyCreatedQuizId}
          />
        </div>
      )}
      {isQuizPublishedPopupOpen && (
        <div className={styles1.popup}>
          <QuizPublishedPopup
            setIsQuizPublishedPopupOpen={setIsQuizPublishedPopupOpen}
            newlyCreatedQuizId={newlyCreatedQuizId}
          />
        </div>
      )}
    </div>
  );
}

export default PollQuestionAnalysis;
