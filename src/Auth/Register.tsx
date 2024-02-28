import React, { useState } from "react";
import "./Register.css";
import axios, { AxiosResponse } from "axios";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { IAuthData } from "./Auth.types";
import { login } from "../redux/slices/authSlice";
import { Box, Button, TextField } from "@mui/material";

const Register: React.FC = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [repeatedPassword, setRepeatedPassword] = useState("");
  const [message, setMessage] = useState("");
  const dispatch = useAppDispatch();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials((prev) => {
      return { ...prev, [e.target.id]: e.target.value };
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response: AxiosResponse<IAuthData> = await axios.post(
        `${process.env.REACT_APP_API_URL}/user/register`,
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
    setCredentials({
      username: "",
      email: "",
      password: "",
    });
  };

  return (
    <Box className="register-container">
      <form onSubmit={handleSubmit} className="register-form">
        <h2>Register</h2>
        {message && <h4>{message}</h4>}
        <TextField
          type="text"
          id="username"
          required
          label="Username"
          variant="outlined"
          value={credentials.username}
          onChange={handleChange}
        />
        <TextField
          error={
            repeatedPassword.length !== 0 &&
            repeatedPassword !== credentials.password
          }
          type="password"
          id="password"
          value={credentials.password}
          onChange={handleChange}
          label="Password"
          required
        />
        <TextField
          error={
            repeatedPassword.length !== 0 &&
            repeatedPassword !== credentials.password
          }
          type="password"
          id="password"
          required
          value={repeatedPassword}
          onChange={(e) => setRepeatedPassword(e.target.value)}
          label="Password"
        />

        <Button type="submit">Register</Button>
      </form>
    </Box>
  );
};

export default Register;
