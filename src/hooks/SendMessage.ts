import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { MessageEmitter } from "../classes/conversation";
import { emitMessage } from "../redux/slices/conversationSlice";
// export const useSendMessage = (message: MessageEmitter) => {
//   const dispatch = useDispatch();
//   dispatch(emitMessage(message.body));
// };
