import React, { useState, useEffect } from "react";
import { Typography, CircularProgress } from "@mui/material";

interface Conversation {
  messages: string[];
}

interface ConversationProps {
  userId: string;
}

const ConversationComponent: React.FC<ConversationProps> = ({ userId }) => {
  useEffect(() => {}, []);
  return (
    <div>
      <Typography variant="h6">Conversation with User {userId}</Typography>
      <ul></ul>
    </div>
  );
};

export default ConversationComponent;
