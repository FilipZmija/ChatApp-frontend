import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  startListeningCofirmationMessage,
  startListeningConversation,
} from "../../redux/slices/conversationSlice";
import { TUser } from "../../types/user";
import { TRoom } from "../../types/room";
import MessagesList from "./MessagesList";
import MessageSender from "./MessageSender";
import { IConversation } from "../../types/messages";

const Conversation = () => {
  const dispatch = useAppDispatch();

  const conversationSuperData = useAppSelector((state) => state.conv);
  const {
    recipient,
    conversation,
  }: { recipient: TUser | TRoom; conversation: IConversation } =
    conversationSuperData;

  useEffect(() => {
    dispatch(startListeningConversation(recipient));
    dispatch(startListeningCofirmationMessage(recipient));
  }, [recipient]);

  return (
    <>
      <div style={{ overflow: "hidden" }}>
        <h2>{recipient.type === "user" ? recipient.name : recipient.name}</h2>
      </div>
      <MessagesList messages={conversationSuperData.conversation.messages} />
      <MessageSender conversation={conversation} recipient={recipient} />
    </>
  );
};

export default Conversation;
