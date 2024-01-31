import React, { useState, useEffect } from "react";
import OptionInputsText from "../Options/OptionInputsText";
import OptionInputsImage from "../Options/OptionInputsImage";
import OptionInputsTextAndImage from "../Options/OptionInputsTextAndImage";
import styles from "./EachQuestion.module.css";
import Timer from "../Timer/Timer";

function EachQuestion({
  questionNumber,
  selected,
  questionsArray,
  onQuestionChange,
  quizType,
  onTimerChange,
  editableQuiz,
}) {
  const [selectedOptionType, setSelectedOptionType] = useState("");

  const [questionValue, setQuestionValue] = useState("");

  useEffect(() => {
    if (editableQuiz) {
      setQuestionValue(questionsArray.question || "");
      setSelectedOptionType(questionsArray.optionType || "");
    }
  }, [editableQuiz, questionsArray]);

  const handleQuestionChange = (e) => {
    const updatedQuestion = {
      ...questionsArray,
      question: e.target.value,
    };

    onQuestionChange(updatedQuestion);
    setQuestionValue(e.target.value);
  };

  const handleSelectedOption = (value) => {
    const updatedQuestion = {
      ...questionsArray,
      optionType: value,
      optionValues: [],
    };
    onQuestionChange(updatedQuestion);
    setSelectedOptionType(value);
  };

  const renderOptionInputs = () => {
    switch (selectedOptionType) {
      case "Text":
        return (
          <OptionInputsText
            questionsArray={questionsArray}
            onQuestionChange={onQuestionChange}
            quizType={quizType}
            editableQuiz={editableQuiz}
            questionNumber={questionNumber}
          />
        );
      case "ImageUrl":
        return (
          <OptionInputsImage
            questionsArray={questionsArray}
            onQuestionChange={onQuestionChange}
            quizType={quizType}
            editableQuiz={editableQuiz}
          />
        );
      case "TextAndImageUrl":
        return (
          <OptionInputsTextAndImage
            questionsArray={questionsArray}
            onQuestionChange={onQuestionChange}
            quizType={quizType}
            editableQuiz={editableQuiz}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ display: selected ? "block" : "none" }}>
      <div className={styles.section1}>
        <input
          className={styles.questionInput}
          type="text"
          value={questionValue}
          onChange={handleQuestionChange}
          placeholder={`Question ${questionNumber}`}
        ></input>
      </div>

      <div className={styles.section2}>
        <div className={styles.margin}>
          <p>Option Type </p>
        </div>

        <div className={styles.margin}>
          <input
            onClick={() => {
              handleSelectedOption("Text");
            }}
            type="radio"
            name={`optionType-${questionNumber}`}
            id={`Text-${questionNumber}`}
            checked={selectedOptionType === "Text"}
          />
          <label htmlFor={`Text-${questionNumber}`}> Text</label>
        </div>

        <div className={styles.margin}>
          <input
            onClick={() => {
              handleSelectedOption("ImageUrl");
            }}
            type="radio"
            name={`optionType-${questionNumber}`}
            id={`ImageUrl-${questionNumber}`}
            checked={selectedOptionType === "ImageUrl"}
          />

          <label htmlFor={`ImageUrl-${questionNumber}`}> Image URL</label>
        </div>

        <div>
          <input
            onClick={() => {
              handleSelectedOption("TextAndImageUrl");
            }}
            type="radio"
            name={`optionType-${questionNumber}`}
            id={`TextAndImageUrl-${questionNumber}`}
            checked={selectedOptionType === "TextAndImageUrl"}
          />
          <label htmlFor={`TextAndImageUrl-${questionNumber}`}> 
             Text & Image URL
          </label>
        </div>
      </div>

      <div className={styles.section3}>
        <div className={styles.optionInputSection}>{renderOptionInputs()}</div>
        {(quizType === "QnA" ||
          (editableQuiz && editableQuiz.type === "QnA")) && (
          <div className={styles.timerWidth}>
            <Timer onTimerChange={onTimerChange} />
          </div>
        )}
      </div>
    </div>
  );
}

export default EachQuestion;
