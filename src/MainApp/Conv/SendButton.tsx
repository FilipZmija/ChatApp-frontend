import React from "react";
import SendIcon from "@mui/icons-material/Send";
import "./SendButton.css";

export default function SendButton() {
  return (
    <button className="send-button" type="submit">
      <SendIcon className="send-icon" />
    </button>
  );
}
