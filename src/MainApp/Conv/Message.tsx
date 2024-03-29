import React from "react";
import { ISingleMessage } from "../../types/messages";
import { useSelector } from "react-redux";
import { useAppSelector } from "../../redux/hooks";
import { Avatar } from "@mui/material";
type TBorderStyle = {
  my: { borderRadius: string };
  guest: { borderRadius: string };
};
export default function Message({
  message,
  nextMessage,
  borderStyle,
}: {
  message: ISingleMessage;
  nextMessage?: ISingleMessage;
  borderStyle: TBorderStyle;
}) {
  const { id: myId } = useAppSelector((state) => state.auth);
  const isMyMessage = myId === message.userId;
  const isNextMyMessage = nextMessage ? myId === nextMessage.userId : true;
  const messageStyle = {
    maxWidth: "70%", // Limit message width to 70% of container
    margin: "0.2rem 0.5rem",
    padding: "0.33rem 1rem",
    fontSize: "16px",
    lineHeight: "1.4",
  };

  const userMessageStyle = {
    ...messageStyle,
    alignSelf: "flex-end", // Right-align user's messages
    backgroundColor: "#007bff", // Blue background for user's messages
    color: "#fff", // White text color for user's messages
  };

  const contactMessageStyle = {
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
            opacity: isNextMyMessage ? 1 : 0,
          }}
        />
      )}
      <div>
        <p style={{ fontSize: "0.5rem", padding: 0, margin: 0 }}>Nick</p>
        <p
          style={
            isMyMessage
              ? { ...userMessageStyle, ...borderStyle.my }
              : { ...contactMessageStyle, ...borderStyle.guest }
          }
        >
          {message.content}
        </p>
      </div>
    </div>
  );
}
