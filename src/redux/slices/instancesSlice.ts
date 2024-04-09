// Slice of store that manages Socket connections
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { TUser } from "../../types/user";
import { ISingleMessage, IConversation } from "../../types/messages";
import { TRoomCreationData } from "../../types/room";

export interface SocketState {
  rooms: string[];
  users: TUser[];
  activeUsers: TUser[];
  searchedUsers: TUser[];
  searchLoading: boolean;
  conversations: IConversation[];
  selection: { id: number; name?: string; type: "user" | "room" };
}

const initialState: SocketState = {
  users: [],
  activeUsers: [],
  searchedUsers: [],
  searchLoading: false,
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
    setActiveUsers: (state, action: PayloadAction<TUser[]>) => {
      state.activeUsers = action.payload;
    },
    setSearchedUsers: (state, action: PayloadAction<TUser[]>) => {
      state.searchedUsers = action.payload;
      state.searchLoading = false;
    },
    updateUser: (state, action: PayloadAction<TUser>) => {
      const { active } = action.payload;
      const indexActive = state.activeUsers.findIndex(
        (user) => user.id === action.payload.id
      );
      const indexUnactive = state.users.findIndex(
        (user) => user.id === action.payload.id
      );

      if (active && indexActive === -1) {
        state.users = state.users.filter(
          (user) => user.id !== action.payload.id
        );
        state.activeUsers.unshift(action.payload);
      } else if (!active && indexUnactive === -1) {
        state.activeUsers = state.activeUsers.filter(
          (user) => user.id !== action.payload.id
        );
        state.users.unshift(action.payload);
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.searchLoading = action.payload;
    },
    selectUser: (
      state,
      action: PayloadAction<{
        id: number;
        type: "user" | "room";
        name?: string;
      }>
    ) => {
      state.selection.id = action.payload.id;
      state.selection.type = action.payload.type;
      state.selection.name = action.payload.name;
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
    updateConversation: (
      state,
      action: PayloadAction<{
        message: { message: ISingleMessage };
        conversation: IConversation;
      }>
    ) => {
      const index = state.conversations.findIndex(
        (conv) => conv.id === action.payload.conversation.id
      );
      if (index === -1) {
        state.conversations.unshift({
          ...action.payload.conversation,
          lastMessage: action.payload.message.message,
        });
      } else {
        state.conversations[index].lastMessage = action.payload.message.message;
        state.conversations.unshift(...state.conversations.splice(index, 1));
      }
      selectUser(action.payload.conversation);
    },
    readLastMessage: (state, action: PayloadAction<number>) => {
      state.conversations.forEach((conv) => {
        if (conv.lastMessage && conv.id === action.payload) {
          conv.lastMessage.status = "seen";
        }
      });
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
          state.conversations.unshift(...state.conversations.splice(index, 1));
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
  setActiveUsers,
  setSearchedUsers,
  stopListeningUser,
  setLoading,
  selectUser,
  setConversations,
  addConvesation,
  reciveGlobalMessage,
  createRoom,
  joinRoom,
  updateConversation,
  updateUser,
  readLastMessage,
} = conversationSlice.actions;
export default conversationSlice.reducer;
