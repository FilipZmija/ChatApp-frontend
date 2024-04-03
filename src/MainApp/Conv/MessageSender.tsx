import React, { useState } from "react";
import { MessageEmitter } from "../../classes/conversation";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { TUser } from "../../types/user";
import { TRoom } from "../../types/room";
import { IConversation } from "../../types/messages";
import { emitMessage } from "../../redux/slices/conversationSlice";
import SendIcon from "@mui/icons-material/Send";
import "./SendButton.css";
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
    <form
      onSubmit={sendMessage}
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-end",
        margin: "1rem",
      }}
    >
      <div
        style={{
          backgroundColor: "#D3D3D3", // Set background color
          borderRadius: "20px",
          width: "55vw",
          padding: "0.3rem",
        }}
      >
        <div
          style={{
            maxHeight: "15vh",
            overflow: "auto", // Add vertical scroll bar if content exceeds the height
            marginRight: "1.2rem",
            marginTop: "0.2rem",
            marginBottom: "0.2rem",
            padding: "0.1rem 1rem",
            wordBreak: "break-word", // Break long words into multiple lines
          }}
          contentEditable={true} // Allow content editing
          onInput={(e) =>
            e.currentTarget.textContent &&
            setTextMessage(e.currentTarget.textContent)
          } // Update textMessage state on input
        />
      </div>
      <button className="send-button" type="submit">
        <SendIcon className="send-icon" />
      </button>
    </form>
  );
}
