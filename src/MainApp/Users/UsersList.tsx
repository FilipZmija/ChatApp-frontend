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
import { selectUser } from "../../redux/slices/instancesSlice";

const UsersList = ({ users }: { users: TUser[] }) => {
  const selectedUser = useAppSelector((state) => state.instance.selection);
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
            onClick={() => dispatch(selectUser({ id: user.id, type: "user" }))}
            selected={selectedUser.id === user.id}
            divider
          >
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: user ? "green" : "red" }}>
                {user.name.charAt(0)}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={user.name}
              sx={{ color: user ? "green" : "red" }}
            />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
};
export default UsersList;
