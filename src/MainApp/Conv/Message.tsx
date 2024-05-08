import React from "react";
import { IMessageCreator } from "../../types/messages";
import { Avatar, Skeleton } from "@mui/material";
import "./ConvStyle/Message.css";

export default function Message({
  message,
  type,
  messageSender,
  nextMessageSender,
  timeDifferenceBack,
}: IMessageCreator) {
  const isMyMessage = messageSender === "me";
  const is10MinutesDifferentBack = Math.floor(timeDifferenceBack / 60000) > 10;

  const isFirstGuestMessage =
    (type === "first" || type === "single") && messageSender !== "me";
  const isLastGuestMessage =
    (type === "last" || type === "single") && messageSender !== "me";
  const isLastMyMessage =
    (type === "last" || type === "single") && messageSender === "me";
  const isLastMessageInConversation = !nextMessageSender;

  const displayableDate = () => {
    const isToday =
      new Date(message.createdAt).getDate() === new Date().getDate();
    const isYesterday =
      new Date(message.createdAt).getDate() === new Date().getDate() - 1;
    const isLessThenWeekOld =
      new Date(message.createdAt).getDate() >= new Date().getDate() - 7;

    const day = new Date(message.createdAt).getDay();
    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    if (isYesterday)
      return (
        "Yesterday " +
        new Date(message.createdAt).toLocaleTimeString(["en-US"], {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    else if (isToday) {
      return new Date(message.createdAt).toLocaleTimeString(["en-US"], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (isLessThenWeekOld) {
      return (
        weekDays[day] +
        " " +
        new Date(message.createdAt).toLocaleTimeString(["en-US"], {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    } else {
      return new Date(message.createdAt).toLocaleTimeString(["en-US"], {
        hour: "2-digit",
        minute: "2-digit",
        month: "short",
        day: "numeric",
      });
    }
  };
  return (
    <>
      {is10MinutesDifferentBack && (
        <p className="message-time">{displayableDate()}</p>
      )}
      <div
        key={message.id}
        className={`${
          isMyMessage && "my"
        }-message-container message-container ${
          isLastGuestMessage && "last"
        }-message-guest`}
      >
        {!isMyMessage && (
          <Avatar
            className={`avatar ${
              isLastGuestMessage ? "visible" : "invisible"
            }-avatar`}
          >
            {message.user.name.charAt(0)}
          </Avatar>
        )}
        <div className="message-box">
          {isFirstGuestMessage && <p className="sender">{message.user.name}</p>}
          <p
            className={`message ${
              messageSender === "me" ? "me" : "guest"
            }-message ${type}-${messageSender === "me" ? "me" : "guest"}`}
          >
            {message.content ? (
              message.content
            ) : message.status === "typing" ? (
              <div className="typing">
                <div className="typing__dot"></div>
                <div className="typing__dot"></div>
                <div className="typing__dot"></div>
              </div>
            ) : (
              <Skeleton variant="text" width={150} />
            )}
          </p>
          {isLastMyMessage && isLastMessageInConversation && (
            <p className="status">{message.status}</p>
          )}
        </div>
      </div>
    </>
  );
}
