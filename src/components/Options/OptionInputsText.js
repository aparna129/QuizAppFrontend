import React, { useState, useEffect } from "react";
import deleteicon from "../../images/deleteIcon.png";
import styles from "./OptionInputs.module.css";

function OptionInputsText({
  questionsArray,
  onQuestionChange,
  quizType,
  editableQuiz,
}) {
  const [options, setOptions] = useState([]);
  
  const [selectedOptionId, setSelectedOptionId] = useState(null);

  useEffect(() => {
    if (editableQuiz) {
      const updatedOptions = questionsArray.optionValues.map(
        (option, index) => ({
          ...option,
          id: `${index + 1}`,
        })
      );
      setOptions(updatedOptions);
      setSelectedOptionId(questionsArray.correctAnswer);
    } else {
      setSelectedOptionId(null);
    }
    // eslint-disable-next-line
  }, [editableQuiz]);

  const handleAddOption = () => {
    setOptions((prevOptions) => {
      if (prevOptions.length < 4) {
        const newOption = {
          id: prevOptions.length + 1,
          value: "",
        };
        const updatedOptions = [...prevOptions, newOption];

        const updatedQuestion = {
          ...questionsArray,
          optionValues: updatedOptions.map((option) => ({
            value: option.value,
            imageUrl: option.imageUrl,
          })),
        };

        onQuestionChange(updatedQuestion);

        return updatedOptions;
      }

      return prevOptions;
    });
  };

  const handleDeleteOption = (id) => {
    if (options.length > 2 && id > 2) {
      setOptions((prevOptions) => {
        const updatedOptions = prevOptions.filter((option) => option.id !== id);

        const updatedQuestion = {
          ...questionsArray,
          optionValues: updatedOptions.map((option) => ({
            value: option.value,
            imageUrl: option.imageUrl,
          })),
        };

        onQuestionChange(updatedQuestion);

        return updatedOptions;
      });
    }
  };

  const handleInputChange = (id, value) => {
    setOptions((prevOptions) => {
      const updatedOptions = prevOptions.map((option) =>
        option.id === id ? { ...option, value } : option
      );
      if (updatedOptions.length < 4 && id === updatedOptions.length) {
        const newOption = {
          id: updatedOptions.length + 1,
          value: "",
        };
        updatedOptions.push(newOption);
      }

      const updatedQuestion = {
        ...questionsArray,
        optionValues: updatedOptions.map((option) => ({
          value: option.value,
          imageUrl: option.imageUrl,
        })),
      };

      onQuestionChange(updatedQuestion);

      return updatedOptions;
    });
  };

  const handleRadioChange = (id) => {
    setOptions((prevOptions) =>
      prevOptions.map((option) =>
        option.id === id ? { ...option, type: "textOptionType" } : option
      )
    );
    setSelectedOptionId(id);

    onQuestionChange({
      ...questionsArray,
      correctAnswer: id,
    });
  };

  return (
    <div>
      {options.map((option) => (
        <div key={option.id} className={styles.optionSection}>
          {quizType === "QnA" && editableQuiz === null && (
            <input
              type="radio"
              name={questionsArray.question}
              id={`option${option.id}`}
              onChange={() => handleRadioChange(option.id)}
            />
          )}

          {editableQuiz && editableQuiz.type === "QnA" && (
            <input
              type="radio"
              name={questionsArray.question}
              id={`option${option.id}`}
              onChange={() => handleRadioChange(option.id)}
              checked={Number(option.id) === Number(selectedOptionId)}
            />
          )}

          <label htmlFor={`option${option.id}`}>
            <input
              style={{
                backgroundColor:
                  option.id === selectedOptionId ||
                  (editableQuiz &&
                    editableQuiz.type === "QnA" &&
                    Number(option.id) === Number(selectedOptionId))
                    ? "#60B84B"
                    : "white",
                color:
                  option.id === selectedOptionId ||
                  (editableQuiz &&
                    editableQuiz.type === "QnA" &&
                    Number(option.id) === Number(selectedOptionId))
                    ? "white"
                    : "black",
              }}
              className={styles.text1}
              type="text"
              placeholder="Text"
              value={option.value}
              onChange={(e) => handleInputChange(option.id, e.target.value)}
            />
          </label>
          {option.id > 2 && (
            <img
              className={styles.deleteicon}
              src={deleteicon}
              alt="deleteicon"
              onClick={() => handleDeleteOption(option.id)}
            />
          )}
        </div>
      ))}

      {options.length < 4 && (
        <div>
          <button className={styles.addOptionBtn} onClick={handleAddOption}>
            Add option
          </button>
        </div>
      )}
    </div>
  );
}
export default OptionInputsText;
