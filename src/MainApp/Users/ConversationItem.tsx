import {
  Avatar,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import React from "react";
import { TConversation } from "../../types/messages";
import { selectUser } from "../../redux/slices/instancesSlice";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../redux/hooks";

export default function ({ conversation }: { conversation: TConversation }) {
  const dispatch = useDispatch();
  const selectedUser = useAppSelector((state) => state.instance.selection);

  return (
    <>
      {
        <ListItemButton
          key={conversation.id}
          onClick={() =>
            conversation.id &&
            dispatch(
              selectUser({
                id: conversation.childId,
                type: conversation.type,
              })
            )
          }
          selected={selectedUser.id === conversation.childId}
          divider
        >
          <ListItemAvatar>
            <Avatar sx={{ bgcolor: conversation ? "green" : "red" }}>
              {conversation.name?.charAt(0).toUpperCase() || "R"}
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={conversation.name}
            sx={{ color: conversation ? "green" : "red" }}
          />
        </ListItemButton>
      }
    </>
  );
}
