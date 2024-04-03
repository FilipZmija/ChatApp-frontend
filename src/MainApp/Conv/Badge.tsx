import React from "react";
import { TUser } from "../../types/user";
import { TRoom } from "../../types/room";
import { Avatar } from "@mui/material";

export default function Badge({ recipient }: { recipient: TUser | TRoom }) {
  recipient.type === "user" && console.log(recipient?.lastActive);
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
      {recipient.id !== -1 ? (
        <>
          <Avatar
            sx={{
              margin: "0.5rem",
              width: "4rem",
              height: "4rem",
              fontSize: "2rem",
            }}
          >
            {recipient.name?.charAt(0).toUpperCase()}
          </Avatar>
          <div style={{ paddingLeft: "0.5rem" }}>
            <h2 style={{ marginBottom: "0", marginTop: "1rem" }}>
              {recipient.name}
            </h2>
            {recipient.type === "user" &&
              (recipient.active ? (
                <p style={{ marginTop: "0rem" }}>Online</p>
              ) : (
                <p style={{ marginTop: "0" }}>
                  Last online: {recipient?.lastActive?.toString()}
                </p>
              ))}
          </div>
        </>
      ) : (
        <h1 style={{ textAlign: "center", width: "60vw" }}>
          Welcome to Filip's Chat App!
        </h1>
      )}
    </div>
  );
}
