import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import UserItem from "./UserItem";
import { getUsers } from "../../redux/slices/instancesSlice";
import { List } from "@mui/material";
import "./UsersStyle/UserList.css";
import SearchBar from "./SearchBar";

export default function UserList() {
  const { users, activeUsers } = useAppSelector((state) => state.instance);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);
  return (
    <div className="users-list-container">
      <SearchBar />
      <List>
        {activeUsers.length > 0 && <h2>Active users</h2>}
        {activeUsers.map((item) => (
          <UserItem user={item} />
        ))}
        {users.length > 0 && <h2>Other </h2>}
        {users.map((item) => (
          <UserItem user={item} />
        ))}
      </List>
    </div>
  );
}
