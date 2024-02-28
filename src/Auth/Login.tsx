import React, { useState } from "react";
import "./Login.css";
import axios, { AxiosResponse } from "axios";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { IAuthData } from "./Auth.types";
import { login } from "../redux/slices/authSlice";
import { Box, TextField } from "@mui/material";

const Login: React.FC = () => {
  const { username, token } = useAppSelector((state) => state.auth);
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const dispatch = useAppDispatch();

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
        const { accessToken: token, username } = response.data;
        dispatch(login({ token, username }));
        localStorage.setItem("token", token);
      } catch (e: any) {
        console.error(e);
        setMessage(
          e.response?.data.message || "An error occurred during registration."
        );
      }
    })();
    setCredentials({
      username: "",
      password: "",
    });
  };
  return (
    <Box className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Login</h2>
        {message && <h4>{message}</h4>}
        <TextField
          type="text"
          id="username"
          value={credentials.username}
          onChange={handleChange}
          required
          label="Username"
        />
        <TextField
          type="password"
          id="password"
          value={credentials.password}
          onChange={handleChange}
          required
          label="Password"
        />
        <button type="submit">Login</button>
        <a href="/register">
          <button type="button">Register</button>
        </a>
      </form>
    </Box>
  );
};

export default Login;
