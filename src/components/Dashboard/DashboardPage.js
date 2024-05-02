import React, { useState, useEffect } from "react";
import SideHeader from "../SideHeader/SideHeader";
import TrendingQuizBox from "../TrendingQuizBox/TrendingQuizBox";
import axios from "axios";
import CreateQuizPopup from "../CreateAndEditQuiz/CreateQuizPopup";
import AddQuestionsPopup from "../Questions/AddQuestionsPopup";
import QuizPublishedPopup from "../ShareQuiz/QuizPublishedPopup";
import styles1 from "../CommonStyles.module.css";
import styles2 from "./Dashboard.module.css";
import ClipLoader from "react-spinners/ClipLoader";

function DashboardPage() {
  const [isCreateQuizPopupOpen, setIsCreateQuizPopupOpen] = useState(false);
  const [isAddQuestionsPopupOpen, setIsAddQuestionsPopupOpen] = useState(false);
  const [isQuizPublishedPopupOpen, setIsQuizPublishedPopupOpen] =
    useState(false);

  const [totalQuizzes, setTotalQuizzes] = useState();
  const [totalQuestions, setTotalQuestions] = useState();
  const [totalImpressions, setTotalImpressions] = useState();
  const [quizzes, setQuizzes] = useState([]);

  const [newlyCreatedQuizId, setNewlyCreatedQuizId] = useState("");

  const token = localStorage.getItem("jwtToken");

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const userId = localStorage.getItem("userId");

  const [error, setError] = useState("");

  const baseUrl = localStorage.getItem("baseUrl");

  // Getting all Quizzes sorted according to highest impressions

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${baseUrl}getAllQuizzes/${userId}`, { headers })
      .then((response) => {
        setError("");
        const {
          totalQuizzes,
          totalQuestions,
          totalImpressions,
          impressionsSortedQuizzes,
        } = response.data;

        setTotalQuizzes(totalQuizzes);
        if (totalQuizzes === 0) {
          setError(
            "You haven't created any Quiz, Click on Create Quiz to create your first Quiz"
          );
        }
        setTotalQuestions(totalQuestions);
        setTotalImpressions(totalImpressions);
        setQuizzes(impressionsSortedQuizzes);
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
          setError("An error occurred fetching quizzes");
        }
        console.log(error);
        setLoading(false);
      });
    // eslint-disable-next-line
  }, [quizzes]);

  const [quizName, setQuizName] = useState("");
  const [quizType, setQuizType] = useState("");
  const [editableQuiz, setEditableQuiz] = useState(null);

  return (
    <div className={styles1.screen}>
      <div className={styles1.sideheader}>
        <SideHeader
          option="dashboard"
          setIsCreateQuizPopupOpen={setIsCreateQuizPopupOpen}
        />
      </div>
      <div className={styles1.background}>
        <div>
          <div className={styles2.section1}>
            <div
              className={styles2.boxes}
              style={{
                color: "#FF5D01",
              }}
            >
              <p>
                <span className={styles2.font}>{totalQuizzes}</span>
                Quiz
              </p>
              <p>Created </p>
            </div>

            <div
              className={styles2.boxes}
              style={{
                color: "#60B84B",
              }}
            >
              <p>
                <span className={styles2.font}>{totalQuestions}</span>
                Questions
              </p>
              <p>Created </p>
            </div>
            <div
              className={styles2.boxes}
              style={{
                color: "#5076FF",
              }}
            >
              <p>
                <span className={styles2.font}>{totalImpressions}</span>
                Total
              </p>
              <p>Impressions </p>
            </div>
          </div>
          <div className={styles2.section2}>
            <p className={styles2.trendingQuiz}>Trending Quizs</p>

            {error && (
              <p style={{ textAlign: "left" }} className={styles1.error}>
                {error}
              </p>
            )}

            <div className={styles2.trendingQuizzesSection}>
              {quizzes.map((quiz) => (
                <TrendingQuizBox
                  quizName={quiz.name}
                  impressions={quiz.impressions}
                  createdAt={quiz.createdAt}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* All popups section */}

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

      {loading && (
        <div className={styles1.loaderContainer}>
          <div className={styles1.loaderBackground} />
          <ClipLoader color={"black"} loading={loading} />
        </div>
      )}
    </div>
  );
}

export default DashboardPage;
