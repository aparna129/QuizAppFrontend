import React, { useState } from "react";
import SignUpDetails from "./SignUpDetails";
import LoginDetails from "./LoginDetails";
import styles from "./SignupLogin.module.css";

function SignupLoginPage() {
  const [isSignUpClicked, setIsSignUpClicked] = useState(true);
  const [isLoginClicked, setIsLoginClicked] = useState(false);

  const handleSignUpButton = () => {
    setIsSignUpClicked(true);
    setIsLoginClicked(false);
  };

  const handleLoginButton = () => {
    setIsLoginClicked(true);
    setIsSignUpClicked(false);
  };

  const handleSignUpSuccess = () => {
    setIsSignUpClicked(false);
    setIsLoginClicked(true);
  };

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <div className={styles.header}>
          <p className={styles.headerText}>QUIZZIE</p>
        </div>

        <div className={styles.section2}>
          <button
            onClick={handleSignUpButton}
            style={{
              boxShadow: isSignUpClicked ? " 0px 0px 50px 0px #0019FF3D" : "",
            }}
            className={styles.signupBtn}
          >
            Sign Up
          </button>
          <button
            onClick={handleLoginButton}
            style={{
              boxShadow: isLoginClicked ? "0px 0px 50px 0px #0019FF3D" : "",
            }}
            className={styles.loginBtn}
          >
            Log In
          </button>
        </div>

        <div className={styles.container2}>
          {isLoginClicked ? (
            <LoginDetails />
          ) : (
            <SignUpDetails onSignUpSuccess={handleSignUpSuccess} />
          )}
        </div>
      </div>
    </div>
  );
}

export default SignupLoginPage;
