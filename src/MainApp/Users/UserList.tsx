import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import UserItem from "./UserItem";
import { getUsers } from "../../redux/slices/instancesSlice";
import { List } from "@mui/material";

export default function UserList() {
  const { users, activeUsers, selection } = useAppSelector(
    (state) => state.instance
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getUsers());
  }, []);
  return (
    <List>
      {activeUsers.length > 0 && <h3>Active users</h3>}
      {activeUsers.map((item) => (
        <UserItem user={item} />
      ))}
      {users.length > 0 && <h3>Other </h3>}
      {users.map((item) => (
        <UserItem user={item} />
      ))}
    </List>
  );
}
