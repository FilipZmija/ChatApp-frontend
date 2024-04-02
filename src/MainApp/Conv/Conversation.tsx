import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  startListeningCofirmationMessage,
  startListeningConversation,
  stopListeningConversation,
} from "../../redux/slices/conversationSlice";
import { TUser } from "../../types/user";
import { TRoom } from "../../types/room";
import MessagesList from "./MessagesList";
import MessageSender from "./MessageSender";
import { IConversation } from "../../types/messages";
import Badge from "./Badge";

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
    return () => {
      dispatch(stopListeningConversation(recipient));
    };
  }, [recipient]);

  return (
    <div
      style={{
        border: "1px solid rgb(0,0,0,0.15)",
        borderTop: "none",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <Badge recipient={recipient} />
      <MessagesList
        messages={conversationSuperData.conversation.messages}
        key={"Converastion" + conversation.id}
      />

      <MessageSender conversation={conversation} recipient={recipient} />
    </div>
  );
};

export default Conversation;
