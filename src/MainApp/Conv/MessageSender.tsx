import React, { useState } from "react";
import { MessageEmitter } from "../../classes/conversation";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { TUser } from "../../types/user";
import { TRoom } from "../../types/room";
import { IConversation } from "../../types/messages";
import { emitMessage } from "../../redux/slices/conversationSlice";

export default function MessageSender({
  conversation,
  recipient,
}: {
  conversation: IConversation;
  recipient: TUser | TRoom;
}) {
  const dispatch = useAppDispatch();
  const { id: myId, name } = useAppSelector((state) => state.auth);
  const [textMessage, setTextMessage] = useState<string>("");

  const sendMessage = () => {
    if (myId) {
      const messageToEmit = new MessageEmitter(
        conversation,
        textMessage,
        myId,
        recipient,
        { id: myId, name, type: "user" }
      );
      dispatch(emitMessage(messageToEmit.body));
    }
  };
  return (
    <div style={{ overflow: "auto" }}>
      <textarea
        placeholder="Type your message here..."
        onChange={(e) => setTextMessage(e.target.value)}
        style={{ width: "20vw", height: "10vh" }}
      />
      <button onClick={() => sendMessage()}>Send</button>
    </div>
  );
}
