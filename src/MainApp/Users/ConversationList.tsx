import React, { useEffect, useState } from "react";
import { List, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { setConversations } from "../../redux/slices/instancesSlice";
import axios from "axios";
import ConversationItem from "./ConversationItem";
import "./UsersStyle/ConvesationList.css";
import { useScrollBottom } from "../../hooks/Scroll";
const ConversationList = () => {
  const { token } = useAppSelector((state) => state.auth);
  const { conversations } = useAppSelector((state) => state.instance);
  const [page, setPage] = useState(1);
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const convListRef = React.useRef<HTMLDivElement>(null);
  const fetchMoreConversations = async () => {
    setLoading(true);

    const params = new URLSearchParams();
    params.append("page", page.toString());
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/conversation/all`,
        { headers: { Authorization: "Bearer " + token }, params }
      );
      dispatch(setConversations([...conversations, ...response.data]));
      setPage(page + 1);
      setLoading(false);
    } catch (e) {
      console.error(e);
    }
  };

  useScrollBottom(convListRef, fetchMoreConversations, !loading);
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
      <Typography variant="h6" sx={{ p: 2 }}>
        Users Online
      </Typography>
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
