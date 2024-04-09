import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import UserItem from "./UserItem";
import { getUsers, setSearchedUsers } from "../../redux/slices/instancesSlice";
import { List } from "@mui/material";
import "./UsersStyle/UserList.css";
import SearchBar from "./SearchBar";
import axios from "axios";
import { useScrollBottom } from "../../hooks/Scroll";

export default function UserList() {
  const { users, activeUsers, searchedUsers } = useAppSelector(
    (state) => state.instance
  );
  const [distanceBottom, setDistanceBottom] = useState(0);
  const userListRef = useRef<HTMLDivElement>(null);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [page, setPage] = useState(1);
  const [username, setUsername] = useState("");
  const token = useAppSelector((state) => state.auth.token);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  useEffect(() => {
    (async () => {
      console.log(!username);
      try {
        setPage(1);
        if (!username) dispatch(setSearchedUsers([]));
        else {
          const params = new URLSearchParams();
          params.append("name", username);
          setLoadingUsers(true);
          const response = await axios.get(
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
  }, [username]);

  const fetchMoreUsers = async () => {
    try {
      const params = new URLSearchParams();
      params.append("name", username);
      params.append("page", page.toString());
      setLoadingUsers(true);
      const response = await axios.get(
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
      setLoadingUsers(false);
    } catch (e) {
      console.log(e);
    }
  };
  const conditions = !loadingUsers && !!username;
  useScrollBottom(userListRef, fetchMoreUsers, conditions);

  return (
    <div className="users-list-container" ref={userListRef}>
      <SearchBar username={username} setUsername={setUsername} />
      {searchedUsers.length > 0 ? (
        <List component={"div"}>
          {searchedUsers.length > 0 && <h2>Search results</h2>}
          {searchedUsers.map((item) => (
            <UserItem user={item} />
          ))}
        </List>
      ) : (
        <List>
          {activeUsers.length > 0 && <h2>Active users</h2>}
          {activeUsers.map((item) => (
            <UserItem user={item} />
          ))}
          <a className="users-loadmore-button">Load more</a>
          {users.length > 0 && <h2>Other </h2>}
          {users.map((item) => (
            <UserItem user={item} />
          ))}
        </List>
      )}
    </div>
  );
}
