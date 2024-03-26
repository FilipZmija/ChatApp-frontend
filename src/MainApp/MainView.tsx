import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { initSocket } from "../redux/slices/socketSlice";
import UserSearchBar from "./Conv/SeachBar";
import Conversation from "./Conv/Conversation";
import UsersList from "./Users/ConversationList";
import axios, { AxiosResponse } from "axios";
import { IConversationData } from "../types/messages";
import { updateInfo } from "../redux/slices/conversationSlice";

export default function MainView() {
  const dispatch = useAppDispatch();
  const { selection } = useAppSelector((state) => state.instance);
  const token = useAppSelector((state) => state.auth.token);
  useEffect(() => {
    dispatch(initSocket());
  }, []);

  useEffect(() => {
    {
      selection.id !== -1 &&
        (async () => {
          const response: AxiosResponse<IConversationData> = await axios.get(
            `${process.env.REACT_APP_API_URL}/conversation/${selection.type}/${selection.id}`,
            {
              headers: {
                Authorization: "Bearer " + token,
              },
            }
          );
          console.log(response.data);
          response.data.recipient.type = selection.type;
          dispatch(updateInfo(response.data));
        })();
    }
  }, [selection]);

  return (
    <>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 25vw)",
          gridTemplateRows: "repeat(10, 10vh)",
        }}
      >
        <div
          style={{
            height: "10vh",
            display: "grid",
            gridColumn: "2/4",
            gridRow: "1",
          }}
        >
          <UserSearchBar />
          {/* <RoomCreationForm /> */}
        </div>
        <div
          style={{
            height: "100vh",
            display: "grid",
            gridColumn: "1",
            gridRow: "1",
            overflow: "auto",
          }}
        >
          <UsersList />
        </div>
        <div
          style={{
            display: "grid",
            gridColumn: "2/5",
            gridRow: "2/11",
            overflow: "auto",
          }}
        >
          <Conversation />
        </div>
      </div>
    </>
  );
}
