import React, { useEffect, useRef, useState } from "react";
import { List } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { setConversations } from "../../redux/slices/instancesSlice";
import axios from "axios";
import ConversationItem from "./ConversationItem";
import "./UsersStyle/ConvesationList.css";
import { useScrollBottom } from "../../hooks/Scroll";
import RoomCreationForm from "../Room/RoomCreationForm";
import Logout from "./Logout";
const ConversationList = () => {
  const { token } = useAppSelector((state) => state.auth);
  const { conversations } = useAppSelector((state) => state.instance);
  const [page, setPage] = useState(1);
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [noMoreData, setNoMoreData] = useState(false);
  const convListRef = useRef<HTMLDivElement>(null);
  const fetchMoreConversations = async () => {
    setLoading(true);
    console.log(conversations);
    const params = new URLSearchParams();
    params.append("page", page.toString());
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/conversation/all`,
        { headers: { Authorization: "Bearer " + token }, params }
      );
      if (response.data.length === 0 || response.data % 15 !== 0)
        setNoMoreData(true);
      dispatch(setConversations([...conversations, ...response.data]));
      setPage(page + 1);
      setLoading(false);
    } catch (e) {
      console.error(e);
    }
  };

  useScrollBottom(convListRef, fetchMoreConversations, !loading && !noMoreData);
  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/conversation/all`,
          { headers: { Authorization: "Bearer " + token } }
        );
        dispatch(setConversations(response.data));
        console.log(response.data);
        setPage(2);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [dispatch, token]);

  return (
    <div className="conversation-list-container" ref={convListRef}>
      <div className="converstaion-header">
        <h2>Chats</h2>
        <div className="room-creation-form">
          <RoomCreationForm />
          <Logout />
        </div>
      </div>
      <List>
        {conversations &&
          conversations.map((conversation) => (
            <ConversationItem conversation={conversation} />
          ))}
      </List>
    </div>
  );
};
export default ConversationList;
