import React from "react";
import LogoutIcon from "@mui/icons-material/Logout";
import { IconButton } from "@mui/material";
import { useAppDispatch } from "../../redux/hooks";
import { logout } from "../../redux/slices/authSlice";

export default function Logout() {
  const dispatch = useAppDispatch();
  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
  };
  return (
    <IconButton onClick={handleLogout}>
      <LogoutIcon />
    </IconButton>
  );
}
