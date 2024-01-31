import { Routes, Route } from "react-router-dom";
import SignupLoginPage from "./components/SignupAndLogin/SignupLoginPage";
import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DashboardPage from "./components/Dashboard/DashboardPage";
import AnalyticsPage from "./components/Analytics/AnalyticsPage";
import QnAQuestionsAnalysis from "./components/QuestionAnalysis/QnAQuestionsAnalysis";
import PollQuestionAnalysis from "./components/QuestionAnalysis/PollQuestionAnalysis";
import LiveQuizInterface from "./components/LiveQuizInterface/LiveQuizInterface";

function App() {
  const baseUrl = "https://quizappbackend-0vgf.onrender.com/";

  localStorage.setItem("baseUrl", baseUrl);

  return (
    <div>
      <ToastContainer position="top-right" />
      <Routes>
        <Route path="/" element={<SignupLoginPage />}></Route>
        <Route path="/dashboard" element={<DashboardPage />}></Route>
        <Route path="/analytics" element={<AnalyticsPage />}></Route>

        <Route
          path="/pollAnalysis/:quizId"
          element={<PollQuestionAnalysis />}
        />
        <Route path="/qnaAnalysis/:quizId" element={<QnAQuestionsAnalysis />} />
        <Route path="/quiz/:quizId" element={<LiveQuizInterface />}></Route>
      </Routes>
    </div>
  );
}

export default App;
