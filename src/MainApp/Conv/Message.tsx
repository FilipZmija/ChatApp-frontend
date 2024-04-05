import React from "react";
import { IMessageCreator } from "../../types/messages";
import { Avatar, Skeleton } from "@mui/material";
import "./ConvStyle/Message.css";

export default function Message({
  message,
  type,
  messageSender,
  nextMessageSender,
}: IMessageCreator) {
  const isMyMessage = messageSender === "me";
  const isFirstGuestMessage =
    (type === "first" || type === "single") && messageSender !== "me";
  const isLastGuestMessage =
    (type === "last" || type === "single") && messageSender !== "me";
  const isLastMyMessage =
    (type === "last" || type === "single") && messageSender === "me";
  const isLastMessageInConversation = !nextMessageSender;
  return (
    <div
      key={message.id}
      className={`${isMyMessage && "my"}-message-container message-container`}
    >
      {!isMyMessage && (
        <Avatar
          className={`avatar ${
            isLastGuestMessage ? "visible" : "invisible"
          }-avatar`}
        >
          {messageSender.charAt(0)}
        </Avatar>
      )}
      <div className="message-box">
        {isFirstGuestMessage && <p className="sender">{messageSender}</p>}
        <p
          className={`message ${
            messageSender === "me" ? "me" : "guest"
          }-message ${type}-${messageSender === "me" ? "me" : "guest"}`}
        >
          {message.content ? (
            message.content
          ) : (
            <Skeleton variant="text" width={150} />
          )}
        </p>
        {isLastMyMessage && isLastMessageInConversation && (
          <p className="status">{message.status}</p>
        )}
      </div>
    </div>
  );
}
