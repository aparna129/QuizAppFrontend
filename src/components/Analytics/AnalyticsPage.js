import React, { useState, useEffect } from "react";
import SideHeader from "../SideHeader/SideHeader";
import editIcon from "../../images/editIcon.png";
import deleteIcon from "../../images/deleteIcon.png";
import shareIcon from "../../images/shareIcon.png";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DeleteQuizPopup from "../DeleteQuiz/DeleteQuizPopup";
import axios from "axios";
import CreateQuizPopup from "../CreateAndEditQuiz/CreateQuizPopup";
import AddQuestionsPopup from "../Questions/AddQuestionsPopup";
import QuizPublishedPopup from "../ShareQuiz/QuizPublishedPopup";
import EditQuizPopup from "../CreateAndEditQuiz/EditQuizPopup";
import styles1 from "../CommonStyles.module.css";
import styles from "./Analytics.module.css";
import ClipLoader from "react-spinners/ClipLoader";

function AnalyticsPage() {
  const navigate = useNavigate();

  const [isCreateQuizPopupOpen, setIsCreateQuizPopupOpen] = useState(false);
  const [isAddQuestionsPopupOpen, setIsAddQuestionsPopupOpen] = useState(false);
  const [isQuizPublishedPopupOpen, setIsQuizPublishedPopupOpen] =
    useState(false);

  const [isEditQuizPopupOpen, setIsEditQuizPopupOpen] = useState(false);

  const handleShareBtn = (quizId) => {
    const link = `https://quizzie-universe-app.netlify.app/quiz/${quizId}`;

    // Copying the link to clipboard , this is object provided by browser
    navigator.clipboard.writeText(link).then(() => {
      toast.success("Link copied to Clipboard");
    });
  };

  const [loading, setLoading] = useState(true);

  const [isDeleteBtnClicked, setIsDeleteBtnClicked] = useState(false);

  const [quizId, setQuizId] = useState(null);

  const handleDeleteBtn = (quizId) => {
    setQuizId(quizId);
    setIsDeleteBtnClicked(true);
  };

  const [quizzes, setQuizzes] = useState([]);

  let quizNumber = 1;

  const token = localStorage.getItem("jwtToken");

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const userId = localStorage.getItem("userId");

  const [error, setError] = useState(false);

  const baseUrl = localStorage.getItem("baseUrl");

  // Getting all Quizzes which are sorted according to date

  useEffect(() => {
    axios
      .get(`${baseUrl}getAllQuizzes/${userId}`, { headers })
      .then((response) => {
        setError("");
        const { dateSortedQuizzes, totalQuizzes } = response.data;
        setQuizzes(dateSortedQuizzes);
        if (totalQuizzes === 0) {
          setError(
            "You haven't created any Quiz, Click on Create Quiz to create your first Quiz"
          );
        }
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

  const handleQuestionWiseAnalysis = (quiz) => {
    if (quiz.type === "Poll Type") {
      navigate(`/pollAnalysis/${quiz._id}`);
    } else {
      navigate(`/qnaAnalysis/${quiz._id}`);
    }
  };

  const handleCloseDeletePopup = () => {
    setIsDeleteBtnClicked(false);
  };

  const [editableQuizName, setEditableQuizName] = useState("");
  const [editableQuizType, setEditableQuizType] = useState("");
  const [editableQuiz, setEditableQuiz] = useState(null);

  const [newlyCreatedQuizId, setNewlyCreatedQuizId] = useState("");

  const handleEditBtn = (quizId, quiz) => {
    setQuizId(quizId);
    setEditableQuizName(quiz.name);
    setEditableQuizType(quiz.type);
    setIsEditQuizPopupOpen(true);
    setEditableQuiz(quiz);
  };

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
        <div>
          <p className={styles.quizAnalysisTitle}>Quiz Analysis</p>

          {error && <p className={styles1.error}>{error}</p>}

          <div className={styles.tableContainer}>
            <p className={styles.tableHeader}>
              <span className={styles.sNo}>S.No</span>
              <span className={styles.quizNameAndImpression}>Quiz Name</span>
              <span className={styles.createdAt}>Created on</span>
              <span className={styles.quizNameAndImpression}>Impression</span>
            </p>

            {quizzes.map((quiz, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: index % 2 === 0 ? "#EDEDED" : "#B3C4FF",
                }}
                className={styles.quizMapping}
              >
                <p className={styles.tableData}>
                  <span className={styles.sNo}>{quizNumber++}</span>
                  <span className={styles.quizNameAndImpression}>
                    {quiz.name}
                  </span>
                  <span className={styles.createdAt}>{quiz.createdAt}</span>
                  <span className={styles.quizNameAndImpression}>
                    {quiz.impressions}
                  </span>
                  <span className={styles.quizIcons}>
                    <img
                      onClick={() => handleEditBtn(quiz._id, quiz)}
                      src={editIcon}
                      alt="editIcon"
                    />
                    <span className={styles.deleteIconContainer}>
                      <img
                        onClick={() => handleDeleteBtn(quiz._id)}
                        src={deleteIcon}
                        alt="deleteIcon"
                      />
                    </span>
                    <span className={styles.shareIconContainer}>
                      <img
                        onClick={() => handleShareBtn(quiz._id)}
                        src={shareIcon}
                        alt="shareIcon"
                      />
                    </span>
                  </span>

                  <span
                    onClick={() => handleQuestionWiseAnalysis(quiz)}
                    className={styles.questionWiseAnalysis}
                  >
                    Question Wise Analysis
                  </span>
                </p>
              </div>
            ))}
          </div>
          <p className={styles.moreQuizText}>{"{more quiz can be added}"}</p>
        </div>
      </div>

      {/* All popups section */}

      {isDeleteBtnClicked && (
        <div className={styles1.popup}>
          <DeleteQuizPopup quizId={quizId} onClose={handleCloseDeletePopup} />
        </div>
      )}

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

      {isEditQuizPopupOpen && (
        <div className={styles1.popup}>
          <EditQuizPopup
            editableQuizName={editableQuizName}
            editableQuizType={editableQuizType}
            setIsEditQuizPopupOpen={setIsEditQuizPopupOpen}
            setIsAddQuestionsPopupOpen={setIsAddQuestionsPopupOpen}
            setEditableQuiz={setEditableQuiz}
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

export default AnalyticsPage;
