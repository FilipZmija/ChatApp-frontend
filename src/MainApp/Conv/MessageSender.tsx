import React, { useState } from "react";
import { MessageEmitter } from "../../classes/conversation";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { TUser } from "../../types/user";
import { TRoom } from "../../types/room";
import { IConversation } from "../../types/messages";
import { emitMessage } from "../../redux/slices/conversationSlice";
import SendButton from "./SendButton";
import "./MessageSender.css";

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

  const sendMessage = (event: React.FormEvent) => {
    event.preventDefault();
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
    <form onSubmit={sendMessage} className="sender-form">
      <div className="sender-container">
        <div
          className="sender-textbox"
          contentEditable={true}
          onInput={(e) =>
            e.currentTarget.textContent &&
            setTextMessage(e.currentTarget.textContent)
          }
        />
      </div>
      <SendButton />
    </form>
  );
}
