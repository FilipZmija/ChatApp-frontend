import React from "react";
import { Avatar, ListItemButton } from "@mui/material";
import { TUser } from "../../types/user";
import { selectUser } from "../../redux/slices/instancesSlice";
import { useAppDispatch } from "../../redux/hooks";
import { calcLastActive } from "../../helpers/time";
import "./UsersStyle/UserItem.css";
export default function UserItem({ user }: { user: TUser }) {
  const dispatch = useAppDispatch();

  return (
    <>
      <ListItemButton
        className="user-list-item-container"
        onClick={() => dispatch(selectUser(user))}
      >
        <Avatar className="avatar">{user.name?.charAt(0)}</Avatar>
        <div className="user-list-item-info">
          <h3>{user.name}</h3>
          <h5>
            {user?.active
              ? "Online"
              : `Last active: ${calcLastActive(user.lastActive)}`}
          </h5>
        </div>
      </ListItemButton>
    </>
  );
}
