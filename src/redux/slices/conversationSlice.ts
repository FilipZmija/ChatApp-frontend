// Slice of store that manages Socket connections
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { TUser } from "../../types/user";

export interface SocketState {
  rooms: string[];
  users: TUser[];
  conversations: string[];
  selection: number;
}

const initialState: SocketState = {
  users: [],
  rooms: [],
  conversations: [],
  selection: -1,
};

const conversationSlice = createSlice({
  name: "convesation",
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
    selectUser: (state, action: PayloadAction<number>) => {
      state.selection = action.payload;
    },
  },
});

export const { getUsers, setUsers, stopListeningUser, selectUser } =
  conversationSlice.actions;
export default conversationSlice.reducer;
