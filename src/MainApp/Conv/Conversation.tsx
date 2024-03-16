import React, { useEffect, useState } from "react";
import { IConversationData, ISingleMessage } from "../../types/messages";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  emitMessage,
  reciveMessage,
  startListeningConversation,
} from "../../redux/slices/conversationSlice";
import { EmitMessage } from "../../classes/conversation";

const Conversation = ({
  conversationData,
}: {
  conversationData: IConversationData;
}) => {
  const { recipient, conversation } = conversationData;
  const userId = useAppSelector((state) => state.auth.id);
  const conversationSuperData = useAppSelector((state) => state.conv);
  const dispatch = useAppDispatch();
  const [messages, setMessages] = useState(conversation?.messages || []);
  const [textMessage, setTextMessage] = useState<string>("");
  useEffect(() => {
    dispatch(startListeningConversation(recipient));

    return () => {};
  }, []);

  useEffect(() => {
    console.log(conversationSuperData);
  }, [conversationSuperData]);
  const sendMessage = () => {
    if (userId) {
      setMessages((prev) => {
        const array = [...prev];
        const newMessage: ISingleMessage = {
          id: null,
          content: textMessage,
          userId,
          type: "message",
        };
        array.push(newMessage);
        return array;
      });

      const messageToEmit = new EmitMessage(
        conversation,
        textMessage,
        userId,
        recipient.id
      );

      console.log(messageToEmit.body);
      dispatch(emitMessage(messageToEmit.body));
    }
  };

  return (
    <div>
      <div>
        <h2>{recipient.type === "user" ? recipient.name : recipient.name}</h2>
      </div>
      {conversationSuperData ? (
        <div>
          {conversationSuperData.conversation?.messages?.map(
            (message, index) => (
              <div key={index}>
                <p>{message.content}</p>
              </div>
            )
          )}
        </div>
      ) : (
        <div>
          <p>No messages yet.</p>
        </div>
      )}

      <div>
        <textarea
          placeholder="Type your message here..."
          onChange={(e) => setTextMessage(e.target.value)}
        />
        <button onClick={() => sendMessage()}>Send</button>
      </div>
    </div>
  );
};

export default Conversation;
