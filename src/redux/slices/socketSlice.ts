// Slice of store that manages Socket connections
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { TUser } from "../../types/user";

export interface SocketState {
  isConnected: boolean;
  rooms: string[];
  users: TUser[];
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
  },
});

export const { initSocket, connectionEstablished, connectionLost } =
  socketSlice.actions;
export default socketSlice.reducer;
