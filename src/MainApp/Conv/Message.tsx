import React from "react";
import { ISingleMessage } from "../../types/messages";
import { useSelector } from "react-redux";
import { useAppSelector } from "../../redux/hooks";
import { Avatar } from "@mui/material";

const firstLastStyles = {
  first: {
    me: { borderRadius: "20px 20px 8px 20px" },
    guest: { borderRadius: "20px 20px 20px 8px" },
  },
  middle: {
    me: { borderRadius: "20px 8px 8px 20px" },
    guest: { borderRadius: "8px 20px 20px 8px" },
  },
  last: {
    me: { borderRadius: "20px 8px 20px 20px" },
    guest: { borderRadius: "8px 20px 20px 20px" },
  },
  single: {
    me: { borderRadius: "20px" },
    guest: { borderRadius: "20px" },
  },
};

export default function Message({
  message,
  type,
  messageSender,
  nextMessageSender,
}: {
  message: ISingleMessage;
  type: "first" | "middle" | "last" | "single";
  messageSender: "me" | "guest";
  nextMessageSender: "me" | "guest";
}) {
  const isMyMessage = messageSender === "me";
  const isMyNextMessage = nextMessageSender === "me";
  const messageStyle = {
    maxWidth: "60%", // Limit message width to 70% of container
    margin: "0.2rem 0.5rem",
    padding: "0.33rem 1rem",
    fontSize: "16px",
    lineHeight: "1.4",
  };

  const myMessageStyle = {
    ...messageStyle,
    alignSelf: "flex-end", // Right-align user's messages
    backgroundColor: "#007bff", // Blue background for user's messages
    color: "#fff", // White text color for user's messages
  };

  const guestMessageStyle = {
    ...messageStyle,
    alignSelf: "flex-start", // Left-align contact's messages
    backgroundColor: "#f0f0f0", // Light gray background for contact's messages
    color: "#333", // Dark text color for contact's messages
  };

  return (
    <div
      key={message.id}
      style={{
        display: "flex",
        flexDirection: isMyMessage ? "row-reverse" : "row",
        alignItems: "end",
        wordBreak: "break-word",
      }}
    >
      {!isMyMessage && (
        <Avatar
          sx={{
            height: "1.5rem",
            width: "1.5rem",
            opacity: isMyNextMessage ? 1 : 0,
          }}
        />
      )}
      {type === "first" && (
        <p style={{ fontSize: "0.5rem", padding: 0, margin: 0 }}>Nick</p>
      )}
      <p
        style={
          isMyMessage
            ? { ...myMessageStyle, ...firstLastStyles[type][messageSender] }
            : {
                ...guestMessageStyle,
                ...firstLastStyles[type][messageSender],
              }
        }
      >
        {message.content}
      </p>
    </div>
  );
}
