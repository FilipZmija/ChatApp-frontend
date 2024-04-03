import React, { useEffect, useState } from "react";
import { Box, Typography, Avatar, ListItemButton } from "@mui/material";
import { TUser } from "../../types/user";
import { selectUser } from "../../redux/slices/instancesSlice";
import { useAppDispatch } from "../../redux/hooks";

export default function UserItem({ user }: { user: TUser }) {
  const dispatch = useAppDispatch();
  console.log(user);
  return (
    <>
      <ListItemButton
        sx={{
          flexDirection: "row",
          alignItem: "center",
        }}
        onClick={() => dispatch(selectUser(user))}
      >
        <Avatar
          sx={{
            width: "3rem",
            height: "3rem",
            fontSize: "1.75rem",
            marginBottom: "0.6rem",
          }}
        >
          {user.name?.charAt(0)}
        </Avatar>
        <div
          style={{
            marginLeft: "0.5rem",
            paddingBottom: "0.6rem",
            borderBottom: "1px solid #ddd",
            width: "100%",
          }}
        >
          <h3 style={{ margin: 0 }}>{user.name}</h3>
          <h5 style={{ margin: 0, fontWeight: "lighter", fontSize: "75%" }}>
            Last active
          </h5>
        </div>
      </ListItemButton>
    </>
  );
}
