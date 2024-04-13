import React, { useState } from "react";
import "./AuthStyle/Login.css";
import axios, { AxiosResponse } from "axios";
import { useAppDispatch } from "../redux/hooks";
import { IAuthData } from "./Auth.types";
import { login } from "../redux/slices/authSlice";
import { Box, TextField } from "@mui/material";

// const generateRandomLoginData = (amount: number) => {
//   const data: { name: string; password: string }[] = [];
//   for (let i = 1; i <= amount; i++) {
//     data.push({ name: `test${i}`, password: `test${i}` });
//   }
//   return data;
// };

// // const randomLoginData = generateRandomLoginData(2);

const Login: React.FC = () => {
  const [credentials, setCredentials] = useState({
    name: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const dispatch = useAppDispatch();
  const [loginMode, setLoginMode] = useState(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials((prev) => {
      return { ...prev, [e.target.id]: e.target.value };
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    (async () => {
      try {
        const response: AxiosResponse<IAuthData> = await axios.post(
          `${process.env.REACT_APP_API_URL}/user/login`,
          credentials
        );
        const { accessToken: token, name, id } = response.data;

        dispatch(login({ token, name, id }));
        localStorage.setItem("token", token);
      } catch (e: any) {
        console.error(e);
        setMessage(
          e.response?.data.message || "An error occurred during login."
        );
      }
    })();
    setCredentials({
      name: "",
      password: "",
    });
  };
  const handleTry = () => {
    (async () => {
      try {
        // const test = randomLoginData[Math.floor(Math.random() * 2)];
        const test = { name: "test", password: "test" };
        const response: AxiosResponse<IAuthData> = await axios.post(
          `${process.env.REACT_APP_API_URL}/user/login`,
          test
        );
        const { accessToken: token, name, id } = response.data;
        dispatch(login({ token, name, id }));
        localStorage.setItem("token", token);
      } catch (e: any) {
        console.error(e);
        setMessage(
          e.response?.data.message || "An error occurred during login."
        );
      }
    })();
  };

  return (
    <Box className="login-container">
      {!loginMode ? (
        <div className="landing-container">
          <div className="landing-box">
            <h2>Hi! My name is Filip.</h2>
            <p>
              This is my chatting app based on Node and React. If you wish to
              check how it works just proceed by clicking the button below! You
              will be logged as test user who has exisitng conversations with
              other users. Otherwise please login or register to create your own
              account.
            </p>
            <button className="try-me-button" onClick={handleTry}>
              Try me!
            </button>
            <button
              className="login-mode-button"
              onClick={() => setLoginMode(true)}
            >
              I want to use my own account
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="login-form">
          <h2>Login</h2>
          {message && <h4>{message}</h4>}
          <TextField
            type="text"
            id="name"
            value={credentials.name}
            onChange={handleChange}
            required
            label="name"
            className="login-input"
          />
          <TextField
            type="password"
            id="password"
            value={credentials.password}
            onChange={handleChange}
            required
            label="Password"
            className="password-input"
          />
          <button type="submit" className="login-button">
            Login
          </button>
          <a href="/register">
            <button type="button" className="register-button">
              Register
            </button>
          </a>
        </form>
      )}
    </Box>
  );
};

export default Login;
