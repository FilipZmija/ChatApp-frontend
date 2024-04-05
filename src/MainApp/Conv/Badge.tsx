import React from "react";
import { TUser } from "../../types/user";
import { TRoom } from "../../types/room";
import { Avatar } from "@mui/material";
import { calcLastActive } from "../../helpers/time";
import "./ConvStyle/Badge.css";
export default function Badge({ recipient }: { recipient: TUser | TRoom }) {
  recipient.type === "user" && console.log(recipient?.lastActive);
  return (
    <div className="badge-container">
      {recipient.id !== 0 ? (
        <>
          <Avatar className="avatar">
            {recipient.name?.charAt(0).toUpperCase()}
          </Avatar>
          <div className="user-info">
            <h2>{recipient.name}</h2>
            {recipient.type === "user" &&
              (recipient.active ? (
                <p>Online</p>
              ) : (
                <p>Last online: {calcLastActive(recipient.lastActive)}</p>
              ))}
          </div>
        </>
      ) : (
        <h1>Welcome to Filip's Chat App!</h1>
      )}
    </div>
  );
}
