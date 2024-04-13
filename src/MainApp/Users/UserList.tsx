import { List } from "@mui/material";
import React from "react";
import UserItem from "./UserItem";
import { TUser } from "../../types/user";

interface Props {
  title: string;
  users: TUser[];
  noMoreActiveUsers?: boolean;
  setActiveUsersPage?: (value: React.SetStateAction<number>) => void;
}

export default function UserList({
  title,
  users,
  noMoreActiveUsers,
  setActiveUsersPage,
}: Props) {
  return (
    <List>
      {users.length > 0 && <h2>{title}</h2>}
      {users.map((item) => (
        <UserItem user={item} />
      ))}
      {!noMoreActiveUsers && setActiveUsersPage && (
        <span
          className="users-loadmore-button"
          onClick={() => setActiveUsersPage((prev) => prev + 1)}
        >
          Load more
        </span>
      )}
    </List>
  );
}
