import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import socketSlice from "./slices/socketSlice";
import conversationSlice from "./slices/conversationSlice";
import socketMiddleware from "./socketMiddleware";
import instancesSlice from "./slices/instancesSlice";
const store = configureStore({
  reducer: {
    auth: authReducer,
    socket: socketSlice,
    conv: conversationSlice,
    instance: instancesSlice,
  },
  middleware(getDefaultMiddleware) {
    return getDefaultMiddleware().concat([socketMiddleware]);
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
