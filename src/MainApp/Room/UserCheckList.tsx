import { TextField } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { TUser } from "../../types/user";
import { useScrollBottom } from "../../hooks/Scroll";
import axios from "axios";
import { useAppSelector } from "../../redux/hooks";
import TwoColumnUserList from "./TwoColumnUserList";

export default function UserCheckList({
  handleUserToggle,
  selectedUsers,
}: {
  selectedUsers: TUser[];
  handleUserToggle: (user: TUser) => void;
}) {
  const { token } = useAppSelector((state) => state.auth);
  const listRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [users, setUsers] = useState<TUser[]>([]);
  const [username, setUsername] = useState("");
  useEffect(() => {
    (async () => {
      setPage(1);
      const params = new URLSearchParams();
      params.append("name", username);
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/user/search`,
        {
          headers: {
            Authorization: `Bearer ` + token,
          },
          params,
        }
      );
      setUsers(response.data.users);
    })();
  }, [token, setUsers, username]);

  const fetchMoreUsers = async () => {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("username", username);
    setLoading(true);
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/user/all`,
      {
        headers: {
          Authorization: `Bearer ` + token,
        },
        params,
      }
    );
    response.data.users.length > 0 &&
      setUsers(
        page === 1 ? response.data.users : [...users, ...response.data.users]
      );
    setPage(page + 1);
    setLoading(false);
  };

  useScrollBottom(listRef, fetchMoreUsers, !loading);
  return (
    <>
      <TextField
        margin="dense"
        id="name"
        name="name"
        label="Username"
        type="text"
        fullWidth
        variant="standard"
        onChange={(e) => setUsername(e.target.value)}
      />
      <div
        className="dialog-users-list-container all-users-container"
        ref={listRef}
      >
        <TwoColumnUserList
          users={users}
          handleUserToggle={handleUserToggle}
          selectedUsers={selectedUsers}
        />
      </div>
    </>
  );
}
