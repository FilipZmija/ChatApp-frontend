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

const readMessagesHelper = (
  state: IConversationData,
  conversationId: number,
  messageId: number,
  reader: boolean
) => {
  if (state.conversation.id === conversationId) {
    if (state.conversation.messages) {
      state.conversation.messages = state.conversation.messages.map(
        (message, index) => {
          if (
            (reader
              ? message.userId === state.recipient.id
              : message.userId !== state.recipient.id) &&
            message.id &&
            message.id <= messageId &&
            message.status === "delivered"
          ) {
            message.status = "seen";
          }
          return message;
        }
      );
    }
  }
};
const initialState: IConversationData = {
  conversation: {
    id: 0,
    childId: 0,
    messages: [],
    type: "user",
    users: [],
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
        users: [],
      };
    },
    updateInfo: (state, action: PayloadAction<IConversationData>) => {
      if (action.payload.conversation)
        state.conversation = action.payload.conversation;
      else {
        state.conversation = initialState.conversation;
      }
      state.recipient = action.payload.recipient;
      if (state.recipient.type === "room") {
        state.recipient.active =
          state.recipient.type === "room" &&
          state.conversation.users.findIndex((user) => user.active) !== -1;
        state.recipient.lastActive =
          state.recipient.type === "room"
            ? state.conversation.users.reduce((acc, curr) => {
                if (curr.lastActive && acc.lastActive) {
                  if (curr.lastActive > acc.lastActive) {
                    return curr;
                  } else return acc;
                } else if (acc.lastActive) {
                  return acc;
                } else {
                  return curr;
                }
              }).lastActive
            : undefined;
      }
      state.loading = false;
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
        if (index !== -1) {
          state.conversation.messages[index].status =
            action.payload.message.message.status;
          state.conversation.messages[index].id =
            action.payload.message.message.id;
        }
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

    readMessages: (
      state,
      action: PayloadAction<{
        conversationId: number;
        messageId: number;
      }>
    ) => {
      const { conversationId, messageId } = action.payload;
      readMessagesHelper(state, conversationId, messageId, true);
    },
    reciveReadMessages: (
      state,
      action: PayloadAction<{
        conversationId: number;
        messageId: number;
      }>
    ) => {
      const { conversationId, messageId } = action.payload;
      readMessagesHelper(state, conversationId, messageId, false);
    },
    clearConversation: (state) => {
      state.conversation = {
        id: 0,
        childId: 0,
        messages: [],
        type: "user",
        users: [],
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
  readMessages,
  reciveReadMessages,
} = conversationSlice.actions;
export default conversationSlice.reducer;
