import React, { useState } from "react";
import "./Register.css";
import axios, { AxiosResponse } from "axios";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { IAuthData } from "./Auth.types";
import { login } from "../redux/slices/authSlice";
import { Box, Button, TextField } from "@mui/material";

const Register: React.FC = () => {
  const [credentials, setCredentials] = useState({
    name: "",
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
      const { accessToken: token, name, id } = response.data;
      dispatch(login({ token, name, id }));
      localStorage.setItem("token", token);
    } catch (e: any) {
      console.error(e);
      setMessage(
        e.response?.data.message || "An error occurred during registration."
      );
    }
    setCredentials({
      name: "",
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
          id="name"
          required
          label="name"
          variant="outlined"
          value={credentials.name}
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
