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
    childId: 0,
    messages: [],
    type: "user",
  },
  recipient: { name: "", id: 0, type: "user" },
  loading: false,
};

const conversationSlice = createSlice({
  name: "convesation",
  initialState,
  reducers: {
    changeSelectedUser: (
      state,
      action: PayloadAction<{
        name?: string;
        id: number;
        type: "user" | "room";
      }>
    ) => {
      state.recipient = action.payload;
      state.conversation = {
        id: 0,
        childId: 0,
        messages: [],
        type: "user",
      };
    },
    updateInfo: (state, action: PayloadAction<IConversationData>) => {
      if (action.payload.conversation)
        state.conversation = action.payload.conversation;
      else {
        state.conversation = initialState.conversation;
      }
      state.recipient = action.payload.recipient;
      state.loading = false;
    },
    emitMessage: (state, action: PayloadAction<IMessageToSocket>) => {
      if (state.conversation?.messages) {
        console.log(action.payload);
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
        message: { message: ISingleMessage };
      }>
    ) => {
      const { createdAt: messageCreatedAt, content } =
        action.payload.message.message;
      if (!state.conversation.id) {
        state.conversation.id = action.payload.conversation.id;
        state.conversation.childId = action.payload.conversation.childId;
        state.conversation.type = action.payload.conversation.type;
      }
      if (state.conversation.messages) {
        const index = state.conversation.messages.findIndex(
          (item) =>
            item.createdAt === messageCreatedAt && item.content === content
        );
        if (index !== -1)
          state.conversation.messages[index].status =
            action.payload.message.message.status;
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
        childId: 0,
        messages: [],
        type: "user",
      };
      state.recipient = { name: "", id: -1, type: "user" };
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    loadMoreMessages: (state, action: PayloadAction<ISingleMessage[]>) => {
      if (state.conversation.messages) {
        state.conversation.messages?.unshift(...action.payload);
        return;
      }
      state.conversation.messages = action.payload;
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
  changeSelectedUser,
  setLoading,
  loadMoreMessages,
} = conversationSlice.actions;
export default conversationSlice.reducer;
