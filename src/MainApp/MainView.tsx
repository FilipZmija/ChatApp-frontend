import React, { useEffect } from "react";
import { io } from "socket.io-client";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  connectionEstablished,
  getUsers,
  initSocket,
} from "../redux/slices/socketSlice";

export default function MainView() {
  const users = useAppSelector((state) => state.socket.users);
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(initSocket());
  }, []);
  return (
    <>
      <button onClick={() => dispatch(getUsers())}>users</button>
      <button onClick={() => console.log(users)}>Print</button>
    </>
  );
}
