// Slice of store that manages Socket connections
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { TUser } from "../../types/user";
import { ISingleMessage, IConversation } from "../../types/messages";
import { TRoomCreationData } from "../../types/room";

export interface SocketState {
  rooms: string[];
  users: TUser[];
  conversations: IConversation[];
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
    createRoom: (state, action: PayloadAction<TRoomCreationData>) => {
      return;
    },
    setConversations: (state, action: PayloadAction<IConversation[]>) => {
      state.conversations = action.payload;
    },
    addConvesation: (state, action) => {
      state.conversations.unshift(action.payload);
    },
    updateConversation: (state, action) => {
      console.log(action.payload);
      const index = state.conversations.findIndex(
        (conv) => conv.id === action.payload.id
      );
      if (index === -1) {
        state.conversations.push(action.payload);
      }
      selectUser(action.payload);
    },
    reciveGlobalMessage: (
      state,
      action: PayloadAction<{
        message: ISingleMessage;
        to: IConversation;
        from: TUser;
      }>
    ) => {
      const { id, type } = action.payload.to;
      const { id: childId, name } = action.payload.from;
      const index = state.conversations.findIndex((conv) => conv.id === id);
      if (index !== -1) {
        state.conversations[index].lastMessage = action.payload.message;
        if (index !== 0) {
          state.conversations.slice(index, 1);
          state.conversations.unshift(state.conversations[index]);
        }
      } else {
        const newConversation: IConversation = {
          id,
          childId,
          type,
          name,
        };
        state.conversations.unshift(newConversation);
        state.conversations[0].lastMessage = action.payload.message;
      }
    },
    joinRoom: (state, action: PayloadAction<IConversation>) => {
      state.conversations.unshift(action.payload);
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
  createRoom,
  joinRoom,
  updateConversation,
} = conversationSlice.actions;
export default conversationSlice.reducer;
