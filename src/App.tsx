import React from "react";
import Login from "./Auth/Login";
import { useAppSelector } from "./redux/hooks";
import MainView from "./MainApp/MainView";

export default function App() {
  const token = useAppSelector((state) => state.auth.token);
  return <div className="App">{token ? <MainView /> : <Login />}</div>;
}
