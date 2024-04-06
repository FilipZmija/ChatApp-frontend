import React, { useEffect, useState } from "react";
import { TextField, Box } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import "./UsersStyle/SearchBar.css";
import axios from "axios";
import {
  setSearchedUsers,
  setLoading,
} from "../../redux/slices/instancesSlice";
const SearchBar: React.FC = () => {
  const token = useAppSelector((state) => state.auth.token);
  const { searchedUsers } = useAppSelector((state) => state.instance);
  const dispatch = useAppDispatch();
  const [username, setUsername] = useState("");
  useEffect(() => {
    if (!username) dispatch(setSearchedUsers([]));
    else {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        params.append("name", username);
        (async () => {
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
          console.log(response);
        })();
      } catch (e) {
        console.log(e);
      }
    }
  }, [username, token]);

  return (
    <>
      <Box className="search-box-container">
        <TextField
          fullWidth
          id="standard-basic"
          label="Username"
          variant="standard"
          onChange={(e) => setUsername(e.target.value)}
        />
        {username && searchedUsers.length === 0 && <h4>No results found...</h4>}
      </Box>
    </>
  );
};

export default SearchBar;
