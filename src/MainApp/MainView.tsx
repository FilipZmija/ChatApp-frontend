import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { initSocket } from "../redux/slices/socketSlice";
import UserSearchBar from "./Conv/SeachBar";
import { Box } from "@mui/material";
import axios, { AxiosResponse } from "axios";
import { IConversationData } from "../types/messages";
import Conversation from "./Conv/Conversation";
import { updateInfo } from "../redux/slices/conversationSlice";

export default function MainView() {
  const { selection } = useAppSelector((state) => state.instance);
  const token = useAppSelector((state) => state.auth.token);
  const [conversationData, setConversationData] = useState<IConversationData>();
  const dispatch = useAppDispatch();

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
          dispatch(updateInfo(response.data));

          setConversationData(response.data);
        })();
    }
  }, [selection]);

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <UserSearchBar />
      </Box>
      <Box></Box>
      {/* {users && <UsersList users={users} />} */}
      {conversationData && <Conversation conversationData={conversationData} />}
    </>
  );
}
