import React, { useEffect, useLayoutEffect, useRef } from "react";
import { ISingleMessage } from "../../types/messages";
import Message from "./Message";

const renderStyles = (messages: ISingleMessage[], index: number) => {
  const firstLastStyles = {
    firstElement: {
      my: { borderRadius: "20px 20px 8px 20px" },
      guest: { borderRadius: "20px 20px 20px 8px" },
    },
    middleElement: {
      my: { borderRadius: "20px 8px 8px 20px" },
      guest: { borderRadius: "8px 20px 20px 8px" },
    },
    lastElement: {
      my: { borderRadius: "20px 8px 20px 20px" },
      guest: { borderRadius: "8px 20px 20px 20px" },
    },
  };

  if (messages[index]?.userId !== messages[index - 1]?.userId) {
    return firstLastStyles.firstElement; // Apply styles for the first element
  } else if (messages[index]?.userId !== messages[index + 1]?.userId) {
    return firstLastStyles.lastElement; // Apply styles for the last element
  }
  return firstLastStyles.middleElement; // Return empty object if neither first nor last element
};

export default function MessagesList({
  messages,
}: {
  messages: ISingleMessage[] | undefined;
}) {
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
          height: "70vh",
          display: "flex",
          flexDirection: "column",
          padding: "0.5rem",
          justifyContent: "flex-end",
        }}
      >
        {messages && messages.length > 0 ? (
          <>
            {messages?.map((_, index) => {
              if (index + 1 < messages.length)
                return (
                  <Message
                    message={messages[index]}
                    nextMessage={messages[index + 1]}
                    borderStyle={renderStyles(messages, index)}
                  />
                );
              else
                return (
                  <Message
                    message={messages[index]}
                    borderStyle={renderStyles(messages, index)}
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
