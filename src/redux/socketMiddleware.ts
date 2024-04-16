import { Middleware } from "redux";
// Actions
import {
  connectionEstablished,
  initSocket,
  connectionLost,
} from "./slices/socketSlice";
import SocketFactory, {
  SocketInterface,
  closeSocketConnection,
} from "./SocketFactory";
import {
  confirmMessage,
  emitMessage,
  readMessages,
  reciveMessage,
  reciveReadMessages,
  startListeningCofirmationMessage,
  startListeningConversation,
  stopListeningConversation,
} from "./slices/conversationSlice";
import {
  createRoom,
  joinRoom,
  reciveGlobalMessage,
  stopListeningUser,
  updateConversation,
  updateUser,
} from "./slices/instancesSlice";
import { IConversation } from "../types/messages";
import { TUser } from "../types/user";
import { logout } from "./slices/authSlice";

enum SocketEvent {
  Connect = "connect",
  Disconnect = "disconnect",
  // Emit events
  JoinRoom = "joinRoom",
  LeaveRoom = "leave-room",
  // On events
  Error = "err",
  Price = "price",
  Message = "message",
  ActiveUsers = "activeUsers",
  Users = "users",
  getUsers = "getUsers",
  User = "user",
  sendMessage = "sendMessage",
  CreateRoom = "createRoom",
  ReadMessages = "readMessages",
}
interface IReadMessagesEvent {
  conversationId: number;
  messageId: number;
}

const socketMiddleware: Middleware = (store) => {
  let socket: SocketInterface | null;
  return (next) => (action) => {
    if (initSocket.match(action)) {
      if (!socket) {
        const token: string = store.getState().auth.token;
        socket = SocketFactory.create(token);
        if (socket) {
          socket.socket.connect();

          socket.socket.on(SocketEvent.Connect, () => {
            store.dispatch(connectionEstablished());
          });
          socket.socket.on(SocketEvent.Error, (message) => {
            console.error(message);
          });
          socket.socket.on(SocketEvent.Message, (message) => {
            store.dispatch(reciveGlobalMessage(message));
          });
          socket.socket.on(
            SocketEvent.JoinRoom,
            (conversation: IConversation) => {
              store.dispatch(joinRoom(conversation));
              if (socket) socket.socket.emit("joinRoom", conversation.childId);
            }
          );
          socket.socket.on(SocketEvent.Disconnect, (reason) => {
            console.log("disconnected: ", reason);
            store.dispatch(connectionLost());
          });
          socket.socket.on(
            SocketEvent.ReadMessages,
            ({ conversationId, messageId }: IReadMessagesEvent) => {
              store.dispatch(reciveReadMessages({ conversationId, messageId }));
            }
          );
          socket.socket.on(SocketEvent.User, (user: TUser) => {
            store.dispatch(updateUser(user));
          });
        }
      }
    }

    if (startListeningConversation.match(action) && socket) {
      const { id, type } = action.payload;
      socket.socket.off(type + "" + id);
      socket.socket.on(type + "" + id, (message) => {
        store.dispatch(reciveMessage(message.message));
      });
    }

    if (stopListeningConversation.match(action) && socket) {
      const { id, type } = action.payload;
      socket.socket.off(type + "" + id);
    }

    if (startListeningCofirmationMessage.match(action) && socket) {
      const { id, type } = action.payload;
      const eventName = "confirmation" + type + "" + id;
      socket.socket.off(eventName);
      socket.socket.on(eventName, (message) => {
        store.dispatch(confirmMessage(message));
        store.dispatch(updateConversation(message));
      });
    }

    if (stopListeningUser.match(action) && socket) {
      socket.socket.off(SocketEvent.ActiveUsers);
    }

    if (emitMessage.match(action) && socket) {
      socket.socket.emit(SocketEvent.sendMessage, action.payload);
    }

    if (createRoom.match(action) && socket) {
      socket.socket.emit(SocketEvent.CreateRoom, action.payload);
    }

    if (readMessages.match(action) && socket) {
      socket.socket.emit(SocketEvent.ReadMessages, action.payload);
    }
    if (logout.match(action) && socket) {
      socket.socket.disconnect();
      socket = null;
      closeSocketConnection();
      store.dispatch(connectionLost());
    }
    next(action);
  };
};

export default socketMiddleware;
