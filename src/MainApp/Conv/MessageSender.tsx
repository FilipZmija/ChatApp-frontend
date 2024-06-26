import React, { useEffect, useRef, useState } from "react";
import { MessageEmitter } from "../../classes/conversation";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { TUser } from "../../types/user";
import { TRoom } from "../../types/room";
import { IConversation } from "../../types/messages";
import {
  emitMessage,
  startTyping,
  stopTyping,
} from "../../redux/slices/conversationSlice";
import SendButton from "./SendButton";
import "./ConvStyle/MessageSender.css";

export default function MessageSender({
  conversation,
  recipient,
}: {
  conversation: IConversation;
  recipient: TUser | TRoom;
}) {
  const dispatch = useAppDispatch();
  const textBoxRef = useRef<HTMLDivElement>(null);
  const { id: myId, name } = useAppSelector((state) => state.auth);
  const [textMessage, setTextMessage] = useState<string>("");
  const [userTyping, setUserTyping] = useState(false);

  useEffect(() => {
    if (myId)
      if (userTyping)
        dispatch(startTyping({ type: conversation.type, id: recipient.id }));
      else dispatch(stopTyping({ type: conversation.type, id: recipient.id }));
  }, [conversation.type, recipient.id, myId, userTyping, dispatch]);

  useEffect(() => {
    if (textMessage.length > 0) {
      setUserTyping(true);
      const debounceTimer = setTimeout(() => {
        setUserTyping(false);
      }, 7000);
      return () => clearTimeout(debounceTimer);
    }
  }, [recipient.id, dispatch, textMessage, myId]);

  const sendMessage = (event: React.FormEvent) => {
    event.preventDefault();
    setUserTyping(false);

    if (myId) {
      const messageToEmit = new MessageEmitter(
        conversation,
        textMessage,
        myId,
        recipient,
        { id: myId, name, type: "user" }
      );
      setTextMessage("");
      dispatch(emitMessage(messageToEmit.body));
      textBoxRef.current?.textContent && (textBoxRef.current.textContent = "");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(e);
    }
  };

  return (
    <form onSubmit={sendMessage} className="sender-form">
      <div className="sender-container">
        <div
          ref={textBoxRef}
          className="sender-textbox"
          contentEditable={true}
          onInput={(e) =>
            e.currentTarget.textContent &&
            setTextMessage(e.currentTarget.textContent)
          }
          onKeyDown={handleKeyDown}
        />
      </div>
      <SendButton />
    </form>
  );
}
