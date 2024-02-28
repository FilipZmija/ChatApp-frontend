import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import socketSlice from "./slices/socketSlice";
import socketMiddleware from "./socketMiddleware";

const store = configureStore({
  reducer: {
    auth: authReducer,
    socket: socketSlice,
  },
  middleware(getDefaultMiddleware) {
    return getDefaultMiddleware().concat([socketMiddleware]);
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
