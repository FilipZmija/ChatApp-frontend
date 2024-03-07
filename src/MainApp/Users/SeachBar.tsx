import React, { useEffect, useState } from "react";
import {
  TextField,
  Autocomplete,
  Box,
  Typography,
  Avatar,
} from "@mui/material";
import {
  getUsers,
  stopListeningUser,
} from "../../redux/slices/conversationSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";

const UserSearchBar: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const users = useAppSelector((state) => state.conv.users);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getUsers());
    return () => {
      dispatch(stopListeningUser());
    };
  }, []);

  return (
    <div>
      <Autocomplete
        id="combo-box-demo"
        options={users}
        sx={{ width: 300 }}
        getOptionLabel={(option) => option.username}
        renderOption={(props, option) => (
          <Box component="li" sx={{ mr: 2, flexShrink: 0 }} {...props}>
            <Box>
              <Avatar sx={{ bgcolor: option ? "green" : "red" }}>
                {option.username.charAt(0)}
              </Avatar>
            </Box>
            <Typography>{option.username}</Typography>
          </Box>
        )}
        renderInput={(params) => <TextField {...params} label="Movie" />}
      />
    </div>
  );
};

export default UserSearchBar;
