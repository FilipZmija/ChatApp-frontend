// Slice of store that manages Socket connections
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { TUser } from "../../types/user";
import {
  IConversationData,
  IMessageToSocket,
  ISingleMessage,
} from "../../types/messages";

const initialState: IConversationData = {
  conversation: {
    id: null,
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
      state.conversation = action.payload.conversation;
      state.recipient = action.payload.recipient;
    },
    emitMessage: (state, action: PayloadAction<IMessageToSocket>) => {
      return;
    },
    reciveMessage: (state, action: PayloadAction<ISingleMessage>) => {
      if (state.conversation?.messages) {
        state.conversation.messages.push(action.payload);
      }
    },
  },
});

export const { emitMessage, reciveMessage, updateInfo } =
  conversationSlice.actions;
export default conversationSlice.reducer;
