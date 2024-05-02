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
      // Giving id for every existing option
      const updatedOptions = questionsArray.optionValues.map(
        (option, index) => ({
          ...option,
          id: `${index + 1}`,
        })
      );
      setOptions(updatedOptions);
      // To show correct answer of a particular question when edit btn is clicked
      setSelectedOptionId(questionsArray.correctAnswer);
    } else {
      setSelectedOptionId(null);
    }
    // eslint-disable-next-line
  }, [editableQuiz]);

  const handleAddOption = () => {
    // prevOptions -> Previous state of options
    setOptions((prevOptions) => {
      if (prevOptions.length < 4) {
        const newOption = {
          id: prevOptions.length + 1,
          value: "",
        };
        // Contains array of all the added options
        const updatedOptions = [...prevOptions, newOption];
        // Updating option Values of current question
        const updatedQuestion = {
          ...questionsArray,
          optionValues: updatedOptions.map((option) => ({
            value: option.value,
            imageUrl: option.imageUrl,
          })),
        };
        // Calling this function from AddQuestions to update question
        onQuestionChange(updatedQuestion);

        return updatedOptions;
      }
      // Updating previous state of options
      return prevOptions;
    });
  };

  const handleDeleteOption = (id) => {
    if (options.length > 2 && id > 2) {
      setOptions((prevOptions) => {
        // Removing the current option
        const updatedOptions = prevOptions.filter((option) => option.id !== id);
        // Updating the optionValues of current question
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
      // Map over the previous options array and update the value of the option with the given id
      const updatedOptions = prevOptions.map((option) =>
        option.id === id ? { ...option, value } : option
      );

      // If the updated options length is less than 4 and the id is the next available id
      if (updatedOptions.length < 4 && id === updatedOptions.length) {
        // Create a new option with the next available id and an empty value
        const newOption = {
          id: updatedOptions.length + 1,
          value: "",
        };

        // Add the new option to the updated options array
        updatedOptions.push(newOption);
      }

      // Create an updated question object with the updated option values
      const updatedQuestion = {
        ...questionsArray,
        optionValues: updatedOptions.map((option) => ({
          value: option.value,
          imageUrl: option.imageUrl,
        })),
      };

      // Call the onQuestionChange function with the updated question object
      onQuestionChange(updatedQuestion);

      // Return the updated options array to options state variable
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

    // Updating the correct Answer when radio btn is clicked for any option
    onQuestionChange({
      ...questionsArray,
      correctAnswer: id,
    });
  };

  return (
    <div>
      {options.map((option) => (
        <div key={option.id} className={styles.optionSection}>
          {/* Showing radio btns only for Qna type */}
          {quizType === "QnA" && editableQuiz === null && (
            <input
              type="radio"
              name={questionsArray.question}
              id={`option${option.id}`}
              onChange={() => handleRadioChange(option.id)}
            />
          )}
          {/* If edit btn is clicked then we will show the correct answer */}
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
                /* Changing bg when any option is clicked or showing correct ans when edit btn is clicked */
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
          {/* Showing del btn only for 3rd and 4th options */}
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

      {/* Showing add option btn only when options length is < 4 */}
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
