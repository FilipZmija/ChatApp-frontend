import React from "react";
import { TUser } from "../../types/user";
import { TRoom } from "../../types/room";
import { Avatar } from "@mui/material";

export default function Badge({ recipient }: { recipient: TUser | TRoom }) {
  return (
    <div
      style={{
        minHeight: "10vh",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        boxShadow: "0px -2px 5px 0px rgba(66, 68, 90, 1)",
        marginRight: "-0.05rem",
        marginLeft: "-0.05rem",
        paddingLeft: "0.5rem",
      }}
    >
      <Avatar
        sx={{
          margin: "0.5rem",
          width: "4rem",
          height: "4rem",
          fontSize: "2rem",
        }}
      >
        {recipient.name?.charAt(0).toUpperCase() || "R"}
      </Avatar>
      <div style={{ paddingLeft: "0.5rem" }}>
        <h2 style={{ marginBottom: "0", marginTop: "1rem" }}>
          {recipient.name}
        </h2>
        {true ? (
          <p style={{ marginTop: "0rem" }}>Online</p>
        ) : (
          <p style={{ marginTop: "0" }}>Last online: </p>
        )}
      </div>
    </div>
  );
}
