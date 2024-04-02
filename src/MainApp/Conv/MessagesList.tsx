import React, { useEffect, useLayoutEffect, useRef } from "react";
import { ISingleMessage } from "../../types/messages";
import Message from "./Message";
import { useAppSelector } from "../../redux/hooks";

const renderStyles = (messages: ISingleMessage[], index: number) => {
  if (messages[index]?.userId !== messages[index - 1]?.userId) {
    if (messages[index + 1]) return "first";
    else return "single";
  } else if (messages[index]?.userId !== messages[index + 1]?.userId) {
    return "last"; // Apply styles for the last element
  }
  return "middle"; // Return empty object if neither first nor last element
};

export default function MessagesList({
  messages,
}: {
  messages: ISingleMessage[] | undefined;
}) {
  const { id: myId } = useAppSelector((state) => state.auth);
  const messagesListRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    messagesListRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    messagesListRef.current?.scrollIntoView();
  }, []);

  useLayoutEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <>
      <div
        style={{
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
          padding: "0.5rem",
        }}
      >
        {messages && messages.length > 0 ? (
          <>
            {messages?.map((_, index) => {
              if (index + 1 < messages.length)
                return (
                  <Message
                    message={messages[index]}
                    type={renderStyles(messages, index)}
                    messageSender={
                      messages[index].userId === myId ? "me" : "guest"
                    }
                    nextMessageSender={
                      messages[index + 1].userId === myId ? "me" : "guest"
                    }
                  />
                );
              else
                return (
                  <Message
                    message={messages[index]}
                    type={renderStyles(messages, index)}
                    messageSender={
                      messages[index].userId === myId ? "me" : "guest"
                    }
                    nextMessageSender={
                      messages[index].userId === myId ? "me" : "guest"
                    }
                  />
                );
            })}
            <div ref={messagesListRef} />
          </>
        ) : (
          <div>
            <p>No messages yet.</p>
          </div>
        )}
      </div>
    </>
  );
}
