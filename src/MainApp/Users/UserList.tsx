import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import UserItem from "./UserItem";
import { getUsers } from "../../redux/slices/instancesSlice";
import { List } from "@mui/material";

export default function UserList() {
  const { users, selection } = useAppSelector((state) => state.instance);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getUsers());
  }, []);
  return (
    <List>
      {users.map((item) => (
        <UserItem user={item} />
      ))}
    </List>
  );
}
