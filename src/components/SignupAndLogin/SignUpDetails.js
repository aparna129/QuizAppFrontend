import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles1 from "../CommonStyles.module.css";
import styles from "./SignupLogin.module.css";

function SignUpDetails({ onSignUpSuccess }) {
  const [signUpData, setSignUpData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSignUpInputChange = (field, value) => {
    setSignUpData({
      ...signUpData,
      [field]: value,
    });
  };

  const [isSignUpClicked, setIsSignUpClicked] = useState(false);
  const [error, setError] = useState("");

  const handleSignUp = () => {
    setIsSignUpClicked(true);
    axios
      .post("https://quizzieappbackend.onrender.com/signup", signUpData)
      .then((response) => {
        const { message } = response.data;
        setError("");
        setSignUpData({
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
        toast.success(message);
        setIsSignUpClicked(false);
        onSignUpSuccess();
      })
      .catch((error) => {
        if (
          error.response &&
          error.response.data &&
          error.response.data.error
        ) {
          setError(error.response.data.error);
        } else {
          setError("An error occurred while creating the user");
        }
        console.log(error);
      });
  };

  return (
    <div className={styles.signupContainer}>
      <div className={styles.signupLoginSection}>
        <div className={styles.fields}>
          <p className={styles.name}>Name</p>
          <p className={styles.fieldHeight}>Email</p>
          <p className={styles.fieldHeight}>Password</p>
          <p className={styles.fieldHeight}>Confirm Password</p>
        </div>

        <div className={styles.formSection}>
          <form method="post" className={styles.signupForm}>
            <p>
              <input
                style={{
                  border:
                    isSignUpClicked && signUpData.username.length === 0
                      ? "1px solid #D60000"
                      : "",
                }}
                className={styles.signupLoginInput}
                value={signUpData.name}
                onChange={(e) =>
                  handleSignUpInputChange("username", e.target.value)
                }
                placeholder={
                  isSignUpClicked && signUpData.username.length === 0
                    ? "Invalid name"
                    : ""
                }
              ></input>
            </p>
            <p>
              <input
                style={{
                  border:
                    isSignUpClicked && signUpData.email.length === 0
                      ? "1px solid #D60000"
                      : "",
                }}
                className={styles.signupLoginInput}
                value={signUpData.email}
                onChange={(e) =>
                  handleSignUpInputChange("email", e.target.value)
                }
                placeholder={
                  isSignUpClicked && signUpData.email.length === 0
                    ? "Invalid email"
                    : ""
                }
              ></input>
            </p>
            <p>
              <input
                style={{
                  border:
                    isSignUpClicked && signUpData.password.length === 0
                      ? "1px solid #D60000"
                      : "",
                }}
                className={styles.signupLoginInput}
                value={signUpData.password}
                onChange={(e) =>
                  handleSignUpInputChange("password", e.target.value)
                }
                placeholder={
                  isSignUpClicked && signUpData.password.length === 0
                    ? "Invalid password"
                    : ""
                }
              ></input>
            </p>
            <p>
              <input
                style={{
                  border:
                    isSignUpClicked &&
                    (signUpData.confirmPassword.length === 0 ||
                      signUpData.confirmPassword !== signUpData.password)
                      ? "1px solid #D60000"
                      : "",
                }}
                className={styles.signupLoginInput}
                value={signUpData.confirmPassword}
                onChange={(e) =>
                  handleSignUpInputChange("confirmPassword", e.target.value)
                }
                placeholder={
                  isSignUpClicked && signUpData.confirmPassword.length === 0
                    ? "Password doesn't match"
                    : ""
                }
              ></input>
            </p>
          </form>
        </div>
      </div>
      <div className={styles.signupBtnSection}>
        <button onClick={handleSignUp} className={styles.signupLoginBtns}>
          Sign-Up
        </button>
      </div>
      <div>
        {error ? (
          <div>
            <p className={styles1.error}>{error}</p>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}

export default SignUpDetails;
