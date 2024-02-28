// Slice of store that manages Socket connections
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { stat } from "fs";

export interface SocketState {
  isConnected: boolean;
  rooms: string[];
  users: string[];
}

const initialState: SocketState = {
  isConnected: false,
  rooms: [],
  users: [],
};

const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    initSocket: () => {
      return;
    },
    connectionEstablished: (state) => {
      state.isConnected = true;
    },
    connectionLost: (state) => {
      state.isConnected = false;
    },
    getUsers: () => {
      return;
    },
    setUsers: (state, action: PayloadAction<string[]>) => {
      state.users = action.payload;
    },
  },
});

export const {
  initSocket,
  connectionEstablished,
  connectionLost,
  getUsers,
  setUsers,
} = socketSlice.actions;
export default socketSlice.reducer;
