import React from "react";
import { ISingleMessage } from "../../types/messages";

export default function MessagesList({
  messages,
}: {
  messages: ISingleMessage[] | undefined;
}) {
  return (
    <>
      {messages ? (
        <div style={{ overflow: "auto" }}>
          {messages?.map((message, index) => (
            <div key={index}>
              <p>{message.content}</p>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <p>No messages yet.</p>
        </div>
      )}
    </>
  );
}
