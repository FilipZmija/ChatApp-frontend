import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { initSocket } from "../redux/slices/socketSlice";
import UserSearchBar from "./Users/SeachBar";
import UsersList from "./Users/UsersList";
import { Box } from "@mui/material";
export default function MainView() {
  const users = useAppSelector((state) => state.conv.users);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(initSocket());
  }, []);

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <UserSearchBar />
      </Box>
      <Box></Box>
      {/* {users && <UsersList users={users} />} */}
    </>
  );
}
