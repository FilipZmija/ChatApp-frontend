import React, { useState } from "react";
import {
  Avatar,
  Box,
  List,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import { TUser } from "../../types/user";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { selectUser } from "../../redux/slices/conversationSlice";

const UsersList = ({ users }: { users: TUser[] }) => {
  const selectedUser = useAppSelector((state) => state.conv.selection);
  const dispatch = useAppDispatch();

  return (
    <Box sx={{ width: "30%", borderRight: 1, borderColor: "divider" }}>
      <Typography variant="h6" sx={{ p: 2 }}>
        Users Online
      </Typography>
      <List>
        {users.map((user) => (
          <ListItemButton
            key={user.id}
            onClick={() => dispatch(selectUser(user.id))}
            selected={selectedUser === user.id}
            divider
          >
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: user ? "green" : "red" }}>
                {user.username.charAt(0)}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={user.username}
              sx={{ color: user ? "green" : "red" }}
            />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
};
export default UsersList;
