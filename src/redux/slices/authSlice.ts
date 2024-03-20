import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  name: string;
  token: string | null;
  id: number | null;
}

const initialState: AuthState = {
  name: "",
  token: null,
  id: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<AuthState>) => {
      state.name = action.payload.name;
      state.token = action.payload.token;
      state.id = action.payload.id;
    },
    logout: (state) => {
      state.name = "";
      state.token = null;
      state.id = null;
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
