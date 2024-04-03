import React, { useEffect, useState } from "react";
import {
  TextField,
  Autocomplete,
  Box,
  Typography,
  Avatar,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { TUser } from "../../types/user";
import { getUsers, selectUser } from "../../redux/slices/instancesSlice";
import UserItem from "./UserItem";
const UserSearchBar: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { users, selection } = useAppSelector((state) => state.instance);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getUsers());
  }, []);
  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <Autocomplete
        id="combo-box-demo"
        options={users}
        sx={{ width: 300 }}
        onChange={(event: any, newValue: TUser | null) => {
          newValue && dispatch(selectUser({ id: newValue.id, type: "user" }));
        }}
        getOptionLabel={(option) => option.name}
        renderOption={(props, option) => (
          <Box component="li" sx={{ mr: 2, flexShrink: 0 }} {...props}>
            <UserItem user={option} />
          </Box>
        )}
        renderInput={(params) => <TextField {...params} label="Movie" />}
      />
    </Box>
  );
};

export default UserSearchBar;
