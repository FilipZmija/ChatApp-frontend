import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { initSocket } from "../redux/slices/socketSlice";
import Conversation from "./Conv/Conversation";
import axios, { AxiosResponse } from "axios";
import { IConversationData } from "../types/messages";
import { setLoading, updateInfo } from "../redux/slices/conversationSlice";
import ConversationList from "./Users/ConversationList";
import UserList from "./Users/UserLists";
import "./MainAppStyle/MainView.css";
export default function MainView() {
  const dispatch = useAppDispatch();
  const { selection } = useAppSelector((state) => state.instance);
  const token = useAppSelector((state) => state.auth.token);
  useEffect(() => {
    dispatch(initSocket(token));
  }, [dispatch, token]);

  useEffect(() => {
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
  }, [selection, dispatch, token]);

  return (
    <>
      <div className="main-container">
        <div className="conversation-list">
          <ConversationList />
        </div>
        <div className="conversation">
          <Conversation />
        </div>
        <div className="user-list">
          <UserList />
        </div>
      </div>
    </>
  );
}
