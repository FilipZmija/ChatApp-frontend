import React, { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  addActiveUsers,
  addUsers,
  setActiveUsers,
  setSearchedUsers,
  setUsers,
} from "../../redux/slices/instancesSlice";
import "./UsersStyle/UserList.css";
import SearchBar from "./SearchBar";
import axios, { AxiosResponse } from "axios";
import { useScrollBottom } from "../../hooks/Scroll";
import UserList from "./UserList";
import { TUser } from "../../types/user";

interface IUsersResponse {
  [key: string]: TUser[];
}

export default function UserLists() {
  const { users, activeUsers, searchedUsers } = useAppSelector(
    (state) => state.instance
  );
  const userListRef = useRef<HTMLDivElement>(null);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [page, setPage] = useState(1);
  const [username, setUsername] = useState("");
  const token = useAppSelector((state) => state.auth.token);
  const dispatch = useAppDispatch();
  const [activeUsersPage, setActiveUsersPage] = useState(1);
  const [noMoreActiveUsers, setNoMoreActiveUsers] = useState(false);
  const [usersPage, setUsersPage] = useState(1);
  const [noMoreUsers, setNoMoreUsers] = useState(false);
  const [noMoreData, setNoMoreData] = useState(false);
  useEffect(() => {
    (async () => {
      try {
        const params = new URLSearchParams();
        params.append("page", activeUsersPage.toString());
        const response: AxiosResponse<IUsersResponse> = await axios.get(
          `${process.env.REACT_APP_API_URL}/user/all/active`,
          {
            headers: {
              Authorization: "Bearer " + token,
            },
            params,
          }
        );
        if (
          response.data.usersActive.length === 0 ||
          response.data.usersActive.length % 10 !== 0
        )
          setNoMoreActiveUsers(true);
        response.data.usersActive && activeUsersPage === 1
          ? dispatch(setActiveUsers(response.data.usersActive))
          : dispatch(addActiveUsers(response.data.usersActive));
      } catch (e) {
        console.log(e);
      }
    })();
  }, [dispatch, token, activeUsersPage]);

  useEffect(() => {
    (async () => {
      try {
        const params = new URLSearchParams();
        params.append("page", usersPage.toString());
        const response: AxiosResponse<IUsersResponse> = await axios.get(
          `${process.env.REACT_APP_API_URL}/user/all/unactive`,
          {
            headers: {
              Authorization: "Bearer " + token,
            },
            params,
          }
        );

        if (
          response.data.usersUnactive.length === 0 ||
          response.data.usersUnactive.length % 10 !== 0
        )
          setNoMoreUsers(true);
        response.data.usersUnactive &&
          (usersPage === 1
            ? dispatch(setUsers(response.data.usersUnactive))
            : dispatch(addUsers(response.data.usersUnactive)));
      } catch (e) {
        console.log(e);
      }
    })();
  }, [dispatch, token, usersPage]);

  useEffect(() => {
    (async () => {
      try {
        setPage(2);
        setNoMoreData(false);
        if (!username) dispatch(setSearchedUsers([]));
        else {
          const params = new URLSearchParams();
          params.append("name", username);
          setLoadingUsers(true);
          const response: AxiosResponse<IUsersResponse> = await axios.get(
            `${process.env.REACT_APP_API_URL}/user/search`,
            {
              headers: {
                Authorization: "Bearer " + token,
              },
              params,
            }
          );

          dispatch(setSearchedUsers(response.data.users));

          setLoadingUsers(false);
        }
      } catch (e) {
        console.log(e);
      }
    })();
  }, [username, dispatch, token]);

  const fetchMoreUsers = async () => {
    try {
      const params = new URLSearchParams();
      params.append("name", username);
      params.append("page", page.toString());
      setLoadingUsers(true);
      const response: AxiosResponse<IUsersResponse> = await axios.get(
        `${process.env.REACT_APP_API_URL}/user/search`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
          params,
        }
      );

      dispatch(setSearchedUsers([...searchedUsers, ...response.data.users]));
      setPage(page + 1);

      if (
        response.data.users.length === 0 ||
        response.data.users.length % 15 !== 0
      )
        setNoMoreData(true);

      setLoadingUsers(false);
    } catch (e) {
      console.log(e);
    }
  };
  const conditions = !loadingUsers && !!username && !noMoreData;
  useScrollBottom(userListRef, fetchMoreUsers, conditions);

  return (
    <div className="users-list-container" ref={userListRef}>
      <SearchBar username={username} setUsername={setUsername} />
      {searchedUsers.length > 0 ? (
        <UserList title="Search results" users={searchedUsers} />
      ) : (
        <>
          <UserList
            title="Active users"
            users={activeUsers}
            noMoreActiveUsers={noMoreActiveUsers}
            setActiveUsersPage={setActiveUsersPage}
          />
          <UserList
            title="Other users"
            users={users}
            noMoreActiveUsers={noMoreUsers}
            setActiveUsersPage={setUsersPage}
          />
        </>
      )}
    </div>
  );
}
