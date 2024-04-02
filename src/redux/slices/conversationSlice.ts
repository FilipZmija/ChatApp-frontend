// Slice of store that manages Socket connections
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { TUser } from "../../types/user";
import {
  IConversation,
  IConversationData,
  IMessageToSocket,
  ISingleMessage,
} from "../../types/messages";
import { TRoom } from "../../types/room";

const initialState: IConversationData = {
  conversation: {
    id: 0,
    childId: -1,
    messages: [],
    type: "user",
  },
  recipient: { name: "", id: -1, type: "user" },
};

const conversationSlice = createSlice({
  name: "convesation",
  initialState,
  reducers: {
    updateInfo: (state, action: PayloadAction<IConversationData>) => {
      if (action.payload.conversation)
        state.conversation = action.payload.conversation;
      state.recipient = action.payload.recipient;
    },
    emitMessage: (state, action: PayloadAction<IMessageToSocket>) => {
      if (state.conversation?.messages) {
        state.conversation.messages.push(action.payload.message);
      }
    },
    reciveMessage: (state, action: PayloadAction<ISingleMessage>) => {
      if (state.conversation?.messages) {
        state.conversation.messages.push(action.payload);
      }
    },
    confirmMessage: (
      state,
      action: PayloadAction<{
        conversation: IConversation;
        message: ISingleMessage;
      }>
    ) => {
      if (!state.conversation.id) {
        state.conversation.id = action.payload.conversation.id;
        state.conversation.childId = action.payload.conversation.childId;
        state.conversation.type = action.payload.conversation.type;
      }
    },
    startListeningConversation: (
      state,
      action: PayloadAction<TUser | TRoom>
    ) => {
      return;
    },
    startListeningCofirmationMessage: (state, action) => {
      return;
    },
    stopListeningConversation: (state, action) => {
      return;
    },
    clearConversation: (state) => {
      state.conversation = {
        id: 0,
        childId: -1,
        messages: [],
        type: "user",
      };
      state.recipient = { name: "", id: -1, type: "user" };
    },
  },
});

export const {
  emitMessage,
  reciveMessage,
  updateInfo,
  startListeningConversation,
  startListeningCofirmationMessage,
  confirmMessage,
  clearConversation,
  stopListeningConversation,
} = conversationSlice.actions;
export default conversationSlice.reducer;
