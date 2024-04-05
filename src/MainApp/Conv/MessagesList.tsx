import React, { useLayoutEffect, useRef, useState } from "react";
import { ISingleMessage } from "../../types/messages";
import Message from "./Message";
import { useAppSelector } from "../../redux/hooks";
import LandingInfo from "./LandingInfo";
import "./ConvStyle/MessagesList.css";
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
  const [shouldScrollToBottom, setShouldScrollToBottom] =
    useState<boolean>(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesListRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  console.log(messagesListRef.current?.getBoundingClientRect().bottom);

  useLayoutEffect(() => {
    messagesEndRef.current?.scrollIntoView();
  }, [id]);

  useLayoutEffect(() => {
    if (shouldScrollToBottom) scrollToBottom();
  }, [messages, shouldScrollToBottom]);

  const handleScroll = () => {
    messagesListRef.current &&
      messagesEndRef.current &&
      console.log(
        messagesEndRef.current.getBoundingClientRect().bottom,
        messagesListRef.current.getBoundingClientRect().bottom
      );
    if (
      messagesListRef.current &&
      messagesEndRef.current &&
      messagesEndRef.current.getBoundingClientRect().bottom <=
        messagesListRef.current.getBoundingClientRect().bottom
    ) {
      setShouldScrollToBottom(true);
    } else {
      setShouldScrollToBottom(false);
    }
  };
  return (
    <>
      {id !== 0 ? (
        <div className="messages-list-container">
          {messages && messages.length > 0 ? (
            <div
              className="messages-list"
              onScroll={handleScroll}
              ref={messagesListRef}
            >
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
              <div ref={messagesEndRef} />
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
