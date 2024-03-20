import { createSlice } from "@reduxjs/toolkit";

export interface SocketState {
  isConnected: boolean;
}

const initialState: SocketState = {
  isConnected: false,
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
