// Slice of store that manages Socket connections
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { TUser } from "../../types/user";
import { IMessage, IMessageToSocket } from "../../types/messages";

export interface SocketState {
  rooms: string[];
  users: TUser[];
  conversations: string[];
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
  },
});

export const { getUsers, setUsers, stopListeningUser, selectUser } =
  conversationSlice.actions;
export default conversationSlice.reducer;
