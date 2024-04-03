import React from "react";
import { IMessageCreator, ISingleMessage } from "../../types/messages";
import { useSelector } from "react-redux";
import { useAppSelector } from "../../redux/hooks";
import { Avatar, Skeleton } from "@mui/material";

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
}: IMessageCreator) {
  const isMyMessage = messageSender === "me";
  const isMyNextMessage = nextMessageSender === "me";
  const isFirstGuestMessage =
    (type === "first" || type === "single") && messageSender !== "me";
  const isLastGuestMessage =
    (type === "last" || type === "single") && messageSender !== "me";
  const messageStyle = {
    maxWidth: "80%", // Limit message width to 70% of container
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
            opacity: isLastGuestMessage ? 1 : 0,
            fontSize: "1rem",
          }}
        >
          {messageSender.charAt(0)}
        </Avatar>
      )}
      <div style={{ display: "flex", flexDirection: "column" }}>
        {isFirstGuestMessage && (
          <p
            style={{
              fontSize: "0.7rem",
              fontWeight: 300,
              padding: 0,
              marginLeft: "0.5rem",
              margin: 0,
            }}
          >
            {messageSender}
          </p>
        )}
        <p
          style={
            isMyMessage
              ? {
                  ...myMessageStyle,
                  ...firstLastStyles[type][
                    messageSender === "me" ? "me" : "guest"
                  ],
                }
              : {
                  ...guestMessageStyle,
                  ...firstLastStyles[type][
                    messageSender === "me" ? "me" : "guest"
                  ],
                }
          }
        >
          {message.content ? (
            message.content
          ) : (
            <Skeleton variant="text" width={150} />
          )}
        </p>
      </div>
    </div>
  );
}
