// Slice of store that manages Socket connections
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { TUser } from "../../types/user";
import {
  IConversationData,
  IMessage,
  IMessageToSocket,
  ISingleMessage,
  TConversation,
} from "../../types/messages";

export interface SocketState {
  rooms: string[];
  users: TUser[];
  conversations: TConversation[];
  selection: { id: number; type: "user" | "room" };
}

const initialState: SocketState = {
  users: [],
  rooms: [],
  conversations: [],
  selection: { id: -1, type: "user" },
};

const conversationSlice = createSlice({
  name: "instance",
  initialState,
  reducers: {
    getUsers: () => {
      return;
    },
    stopListeningUser: () => {
      return;
    },
    setUsers: (state, action: PayloadAction<TUser[]>) => {
      state.users = action.payload;
    },
    selectUser: (
      state,
      action: PayloadAction<{ id: number; type: "user" | "room" }>
    ) => {
      state.selection = action.payload;
    },
    setConversations: (state, action: PayloadAction<TConversation[]>) => {
      state.conversations = action.payload;
    },
    addConvesation: (state, action) => {
      state.conversations.push(action.payload);
    },
    reciveGlobalMessage: (
      state,
      action: PayloadAction<{ message: ISingleMessage; to: TConversation }>
    ) => {
      const { childId } = action.payload.to;
      const index = state.conversations.findIndex(
        (conv) => conv.childId === childId
      );
      state.conversations[index].lastMessage = action.payload.message;
    },
  },
});

export const {
  getUsers,
  setUsers,
  stopListeningUser,
  selectUser,
  setConversations,
  addConvesation,
  reciveGlobalMessage,
} = conversationSlice.actions;
export default conversationSlice.reducer;
