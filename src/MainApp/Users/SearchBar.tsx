import React from "react";
import { TextField, Box } from "@mui/material";
import { useAppSelector } from "../../redux/hooks";
import "./UsersStyle/SearchBar.css";

const SearchBar = ({
  username,
  setUsername,
}: {
  username: string;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const { searchedUsers } = useAppSelector((state) => state.instance);

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
