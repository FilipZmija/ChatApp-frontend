import React, { useEffect, useState } from "react";
import { Box, List, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { setConversations } from "../../redux/slices/instancesSlice";
import axios from "axios";
import ConversationItem from "./ConversationItem";
const UsersList = () => {
  const { token } = useAppSelector((state) => state.auth);
  const { conversations } = useAppSelector((state) => state.instance);
  const dispatch = useAppDispatch();

  useEffect(() => {
    (async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/conversation/all`,
        { headers: { Authorization: "Bearer " + token } }
      );
      dispatch(setConversations(response.data));
    })();
  }, []);
  console.log(conversations);
  return (
    <Box sx={{ width: "30%", borderRight: 1, borderColor: "divider" }}>
      <Typography variant="h6" sx={{ p: 2 }}>
        Users Online
      </Typography>
      <List>
        {conversations &&
          conversations.map((conversation) => (
            <ConversationItem conversation={conversation} />
          ))}
      </List>
    </Box>
  );
};
export default UsersList;
