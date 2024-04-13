import React from "react";
import { Avatar, Checkbox, List, ListItem, ListItemText } from "@mui/material";
import { TUser } from "../../types/user";

export default function TwoColumnUserList({
  users,
  handleUserToggle,
  selectedUsers,
}: {
  users?: TUser[];
  handleUserToggle: (user: TUser) => void;
  selectedUsers: TUser[];
}) {
  const userList = users || selectedUsers;
  return userList.length > 0 ? (
    <>
      <List className="users-list">
        {userList.map(
          (user, index) =>
            index % 2 === 0 && (
              <ListItem
                key={user.id}
                onClick={() => handleUserToggle(user)}
                sx={{ paddingLeft: "0", paddingRight: "0" }}
              >
                <Avatar sx={{ marginRight: "8px" }}>
                  {user.name.charAt(0).toUpperCase()}
                </Avatar>
                <ListItemText primary={user.name} />
                <Checkbox
                  checked={selectedUsers.includes(user)}
                  onChange={() => handleUserToggle(user)}
                />
              </ListItem>
            )
        )}
      </List>
      <List className="users-list">
        {userList.map(
          (user, index) =>
            index % 2 !== 0 && (
              <ListItem
                key={user.id}
                onClick={() => handleUserToggle(user)}
                sx={{ paddingLeft: "0", paddingRight: "0" }}
              >
                <Avatar sx={{ marginRight: "8px" }}>
                  {user.name.charAt(0).toUpperCase()}
                </Avatar>
                <ListItemText primary={user.name} />
                <Checkbox
                  checked={selectedUsers.includes(user)}
                  onChange={() => handleUserToggle(user)}
                />
              </ListItem>
            )
        )}
      </List>
    </>
  ) : (
    <h5>No results found</h5>
  );
}
