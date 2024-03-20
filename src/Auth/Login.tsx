import React, { useEffect, useLayoutEffect, useState } from "react";
import "./Login.css";
import axios, { AxiosResponse } from "axios";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { IAuthData } from "./Auth.types";
import { login } from "../redux/slices/authSlice";
import { Box, TextField } from "@mui/material";

const Login: React.FC = () => {
  const [credentials, setCredentials] = useState({
    name: "",
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
        const { accessToken: token, name, id } = response.data;
        dispatch(login({ token, name, id }));
        localStorage.setItem("token", token);
      } catch (e: any) {
        console.error(e);
        setMessage(
          e.response?.data.message || "An error occurred during registration."
        );
      }
    })();
    setCredentials({
      name: "",
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
          id="name"
          value={credentials.name}
          onChange={handleChange}
          required
          label="name"
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
