import React from "react";
import { ListItemButton } from "@mui/material";
import { TUser } from "../../types/user";
import { selectUser } from "../../redux/slices/instancesSlice";
import { useAppDispatch } from "../../redux/hooks";
import "./UsersStyle/UserItem.css";
import UserCard from "./UserCard";
export default function UserItem({ user }: { user: TUser }) {
  const dispatch = useAppDispatch();

  return (
    <>
      <ListItemButton onClick={() => dispatch(selectUser(user))}>
        <UserCard user={user} />
      </ListItemButton>
    </>
  );
}
