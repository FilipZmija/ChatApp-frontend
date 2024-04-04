import React, { useEffect, useLayoutEffect, useRef } from "react";
import { IMessageCreator, ISingleMessage } from "../../types/messages";
import Message from "./Message";
import { useAppSelector } from "../../redux/hooks";
import LandingInfo from "./LandingInfo";
import "./MessagesList.css";
import { TUser } from "../../types/user";
import { TRoom } from "../../types/room";

const renderStyles = (messages: { userId: number }[], index: number) => {
  if (messages[index]?.userId !== messages[index - 1]?.userId) {
    if (messages[index].userId === messages[index + 1]?.userId) return "first";
    else return "single";
  } else if (messages[index]?.userId !== messages[index + 1]?.userId) {
    return "last"; // Apply styles for the last element
  }
  return "middle"; // Return empty object if neither first nor last element
};

const messageIndicators = (amount: number, id: number) => {
  const messages: {
    userId: number;
    message: { id: number; content: string; status: string };
  }[] = [];
  for (let i = 0; i < amount; i++) {
    messages.push({
      userId: Math.random() > 0.5 ? id : 0,
      message: { id: i, content: "", status: "sent" },
    });
  }
  return messages;
};

export default function MessagesList({
  messages,
  id,
  recipient,
}: {
  messages: ISingleMessage[] | undefined;
  id: number;
  recipient: TUser | TRoom;
}) {
  const { id: myId } = useAppSelector((state) => state.auth);
  const { loading } = useAppSelector((state) => state.conv);

  const messagesListRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    messagesListRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useLayoutEffect(() => {
    messagesListRef.current?.scrollIntoView();
  }, [id]);
  useLayoutEffect(() => {
    scrollToBottom();
  }, [messages]);
  return (
    <>
      {id !== 0 ? (
        <div className="messages-list-container">
          {messages && messages.length > 0 ? (
            <div className="messages-list">
              {messages?.map((_, index) => {
                if (index + 1 < messages.length)
                  return (
                    <Message
                      message={messages[index]}
                      type={renderStyles(messages, index)}
                      messageSender={
                        messages[index].userId === myId ? "me" : recipient.name
                      }
                      nextMessageSender={
                        messages[index + 1].userId === myId
                          ? "me"
                          : recipient.name
                      }
                    />
                  );
                else
                  return (
                    <Message
                      message={messages[index]}
                      type={renderStyles(messages, index)}
                      messageSender={
                        messages[index].userId === myId ? "me" : recipient.name
                      }
                      nextMessageSender={null}
                    />
                  );
              })}
              <div ref={messagesListRef} />
            </div>
          ) : (
            <>
              {loading && myId ? (
                messageIndicators(21, myId).map((item, index, messages) => {
                  return (
                    <Message
                      message={messages[index].message}
                      type={renderStyles(messages, index)}
                      messageSender={
                        messages[index].userId === myId ? "me" : "guest"
                      }
                      nextMessageSender={
                        messages[index].userId === myId ? "me" : "guest"
                      }
                    />
                  );
                })
              ) : (
                <div className="messages-landing">
                  <p>Send your first message!</p>
                </div>
              )}
            </>
          )}
        </div>
      ) : (
        <LandingInfo />
      )}
    </>
  );
}
