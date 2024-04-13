import React, { useState } from "react";
import "./AuthStyle/Register.css";
import axios, { AxiosResponse } from "axios";
import { useAppDispatch } from "../redux/hooks";
import { IAuthData } from "./Auth.types";
import { login } from "../redux/slices/authSlice";
import { Box, TextField } from "@mui/material";

const Register: React.FC = () => {
  const [credentials, setCredentials] = useState({
    name: "",
    password: "",
    repeatedPassword: "",
  });
  const [message, setMessage] = useState("");
  const dispatch = useAppDispatch();
  const [error, setError] = useState("");
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
      setMessage("Acount created succesfully");
      setError("");
    } catch (e: any) {
      console.error(e);
      setError(
        e.response?.data.message || "An error occurred during registration."
      );
      setMessage("");
    }
    setCredentials({
      name: "",
      repeatedPassword: "",
      password: "",
    });
  };

  return (
    <Box className="register-container">
      <form onSubmit={handleSubmit} className="register-form">
        <h2>Register</h2>
        {message && <h4 className="success">{message}</h4>}
        {error && <h4>{error}</h4>}

        <TextField
          type="text"
          id="name"
          required
          label="name"
          variant="outlined"
          value={credentials.name}
          onChange={handleChange}
          className="register-input"
        />
        <TextField
          error={
            credentials.repeatedPassword.length !== 0 &&
            credentials.repeatedPassword !== credentials.password
          }
          type="password"
          id="password"
          value={credentials.password}
          onChange={handleChange}
          label="Password"
          required
          className="register-input"
        />
        <TextField
          error={
            credentials.repeatedPassword.length !== 0 &&
            credentials.repeatedPassword !== credentials.password
          }
          type="password"
          id="repeatedPassword"
          required
          value={credentials.repeatedPassword}
          onChange={handleChange}
          label="Password"
          className="register-input"
        />

        <button type="submit" className="register-button">
          Register
        </button>
        <a href="/">
          <button type="button" className="login-button">
            Login
          </button>
        </a>
      </form>
    </Box>
  );
};

export default Register;
