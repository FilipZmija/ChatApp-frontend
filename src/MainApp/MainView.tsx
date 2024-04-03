import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { initSocket } from "../redux/slices/socketSlice";
import UserSearchBar from "./Users/SeachBar";
import Conversation from "./Conv/Conversation";
import UsersList from "./Users/ConversationList";
import axios, { AxiosResponse } from "axios";
import { IConversationData } from "../types/messages";
import {
  changeSelectedUser,
  clearConversation,
  setLoading,
  updateInfo,
} from "../redux/slices/conversationSlice";
import ConversationList from "./Users/ConversationList";
import UserList from "./Users/UserList";

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
          dispatch(setLoading(true));
          const response: AxiosResponse<IConversationData> = await axios.get(
            `${process.env.REACT_APP_API_URL}/conversation/${selection.type}/${selection.id}`,
            {
              headers: {
                Authorization: "Bearer " + token,
              },
            }
          );
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
          gridTemplateColumns: "repeat(16, 6.25vw)",
          gridTemplateRows: "repeat(10, 10vh)",
        }}
      >
        <div
          style={{
            height: "100vh",
            display: "grid",
            gridColumn: "1/4",
            gridRow: "1",
          }}
        >
          <ConversationList />
        </div>
        <div
          style={{
            display: "grid",
            gridColumn: "4/14",
            gridRow: "1/11",
            overflow: "auto",
          }}
        >
          <Conversation />
        </div>
        <div
          style={{
            height: "10vh",
            display: "grid",
            gridColumn: "14/17",
            gridRow: "1",
          }}
        >
          {/* <UserSearchBar /> */}
          {/* <RoomCreationForm /> */}
          <UserList />
        </div>
      </div>
    </>
  );
}
