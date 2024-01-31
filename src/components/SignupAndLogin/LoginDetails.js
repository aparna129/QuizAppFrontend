import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles1 from "../CommonStyles.module.css";
import styles from "./SignupLogin.module.css";

function LoginDetails() {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handleLoginInputChange = (field, value) => {
    setLoginData({ ...loginData, [field]: value });
  };

  const navigate = useNavigate();

  const [error, setError] = useState("");

  const [isLoginClicked, setIsLoginClicked] = useState(false);

  const baseUrl = localStorage.getItem("baseUrl");

  const handleLoginBtn = () => {
    setIsLoginClicked(true);
    axios
      .post(`${baseUrl}login`, loginData)
      .then((response) => {
        const { message } = response.data;
        toast.success(message);
        const { jwttoken } = response.data;
        localStorage.setItem("jwtToken", jwttoken);
        const { userId } = response.data;
        localStorage.setItem("userId", userId);
        setError("");
        setLoginData({
          email: "",
          password: "",
        });
        setIsLoginClicked(false);
        navigate("/dashboard");
      })
      .catch((error) => {
        if (
          error.response &&
          error.response.data &&
          error.response.data.error
        ) {
          setError(error.response.data.error);
        } else {
          setError("An error occurred while log in");
        }
        console.log(error);
      });
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.signupLoginSection}>
        <div className={styles.fields}>
          <p className={styles.fieldHeight}>Email</p>
          <p className={styles.fieldHeight}>Password</p>
        </div>

        <div className={styles.formSection}>
          <form method="post" className={styles.loginForm}>
            <p>
              <input
                style={{
                  border:
                    isLoginClicked && loginData.email.length === 0
                      ? "1px solid #D60000"
                      : "",
                }}
                className={styles.signupLoginInput}
                value={loginData.email}
                onChange={(e) =>
                  handleLoginInputChange("email", e.target.value)
                }
                placeholder={
                  isLoginClicked && loginData.email.length === 0
                    ? "Invalid email"
                    : ""
                }
              ></input>
            </p>
            <p>
              <input
                style={{
                  border:
                    isLoginClicked && loginData.password.length === 0
                      ? "1px solid #D60000"
                      : "",
                }}
                className={styles.signupLoginInput}
                value={loginData.password}
                onChange={(e) =>
                  handleLoginInputChange("password", e.target.value)
                }
                placeholder={
                  isLoginClicked && loginData.password.length === 0
                    ? "Invalid password"
                    : ""
                }
              ></input>
            </p>
          </form>
        </div>
      </div>
      <div className={styles.loginBtnSection}>
        <button onClick={handleLoginBtn} className={styles.signupLoginBtns}>
          Log In
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

export default LoginDetails;
