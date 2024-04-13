// Slice of store that manages Socket connections
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { TUser } from "../../types/user";
import {
  ISingleMessage,
  IConversation,
  IConversationCard,
} from "../../types/messages";
import { TRoomCreationData } from "../../types/room";
export interface SelectedUser {
  id: number;
  type: "user" | "room";
  name?: string;
}
export interface SocketState {
  rooms: string[];
  users: TUser[];
  activeUsers: TUser[];
  searchedUsers: TUser[];
  searchLoading: boolean;
  conversations: IConversationCard[];
  selection: SelectedUser;
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
    stopListeningUser: () => {
      return;
    },
    setUsers: (state, action: PayloadAction<TUser[]>) => {
      state.users = action.payload;
    },
    addUsers: (state, action: PayloadAction<TUser[]>) => {
      state.users = [...state.users, ...action.payload];
    },
    setActiveUsers: (state, action: PayloadAction<TUser[]>) => {
      state.activeUsers = action.payload;
    },
    addActiveUsers: (state, action: PayloadAction<TUser[]>) => {
      state.activeUsers = [...state.activeUsers, ...action.payload];
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
      const conversation = state.conversations.findIndex(
        (conv) =>
          conv.recipient.id === action.payload.id && conv.type === "user"
      );
      const roomConversation = state.conversations.filter(
        (conv) =>
          conv.usersIds?.includes(action.payload.id) && conv.type === "room"
      );
      for (let roomConv of roomConversation) {
        const index = state.conversations.findIndex(
          (conv) => roomConv.id === conv.id
        );
        if (index !== -1) {
          state.conversations[index].recipient.active = action.payload.active;
        }
      }

      if (conversation !== -1) {
        state.conversations[conversation].recipient = action.payload;
      }

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
    selectUser: (state, action: PayloadAction<SelectedUser>) => {
      state.selection.id = action.payload.id;
      state.selection.type = action.payload.type;
      state.selection.name = action.payload.name;
    },
    createRoom: (state, action: PayloadAction<TRoomCreationData>) => {
      return;
    },
    setConversations: (state, action: PayloadAction<IConversationCard[]>) => {
      state.conversations = action.payload;
    },
    addConvesation: (state, action) => {
      state.conversations.unshift(action.payload);
    },
    updateConversation: (
      state,
      action: PayloadAction<{
        message: { message: ISingleMessage };
        conversation: IConversationCard;
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
        const newConvs = [...state.conversations];
        newConvs.splice(index, 1);
        newConvs.unshift(state.conversations[index]);
        state.conversations = newConvs;
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
      const { id, type, users } = action.payload.to;
      const { id: childId, name } = action.payload.from;
      const index = state.conversations.findIndex((conv) => conv.id === id);
      if (index !== -1) {
        state.conversations[index].lastMessage = action.payload.message;
        if (index !== 0) {
          const newConvs = [...state.conversations];
          newConvs.splice(index, 1);
          newConvs.unshift(state.conversations[index]);
          state.conversations = newConvs;
        }
      } else {
        const newConversation: IConversation = {
          id,
          childId,
          type,
          name,
          users,
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
  setUsers,
  setActiveUsers,
  addUsers,
  addActiveUsers,
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
