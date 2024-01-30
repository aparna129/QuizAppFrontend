import React, { useState, useEffect } from "react";
import deleteicon from "../../images/deleteIcon.png";
import styles from "./OptionInputs.module.css";

function OptionInputsImage({
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
    }
    // eslint-disable-next-line
  }, [editableQuiz]);

  const handleAddOption = () => {
    setOptions((prevOptions) => {
      if (prevOptions.length < 4) {
        const newOption = {
          id: prevOptions.length + 1,
          imageUrl: "",
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
        option.id === id ? { ...option, imageUrl: value } : option
      );

      if (updatedOptions.length < 4 && id === updatedOptions.length) {
        const newOption = {
          id: updatedOptions.length + 1,
          imageUrl: "",
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
    if (id !== selectedOptionId) {
      setOptions((prevOptions) =>
        prevOptions.map((option) =>
          option.id === id ? { ...option, type: "imageOptionType" } : option
        )
      );

      setSelectedOptionId(id);

      const questionIndex = id - 1;

      onQuestionChange({
        ...questionsArray,
        correctAnswer: questionIndex,
      });
    }
  };

  return (
    <div>
      {options.map((option) => (
        <div key={option.id} className={styles.optionSection}>
          {quizType === "QnA" && editableQuiz === null && (
            <input
              type="radio"
              name="OptionsGroup"
              id={`option${option.id}`}
              onChange={() => handleRadioChange(option.id)}
            />
          )}
          <label htmlFor={`option${option.id}`}>
            <input
              style={{
                backgroundColor:
                  option.id === selectedOptionId ? "#60B84B" : "white",
                color: option.id === selectedOptionId ? "white" : "black",
              }}
              className={styles.image1}
              type="text"
              placeholder="Image URL"
              value={option.imageUrl}
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

export default OptionInputsImage;
