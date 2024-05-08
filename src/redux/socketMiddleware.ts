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
  setUserStopTypingConversation,
  setUserTypingConversation,
  startListeningCofirmationMessage,
  startListeningConversation,
  startTyping,
  stopListeningConversation,
  stopTyping,
} from "./slices/conversationSlice";
import {
  createRoom,
  joinRoom,
  reciveGlobalMessage,
  setUserStopTyping,
  setUserTyping,
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
  UserTyping = "userTyping",
  UserStopTyping = "userStopTyping",
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
          socket.socket.on(
            SocketEvent.UserTyping,
            ({ user, id }: { user: TUser; id: number }) => {
              console.log("start", user.id);
              store.dispatch(setUserTyping({ user, id }));
            }
          );
          socket.socket.on(
            SocketEvent.UserStopTyping,
            ({ user, id }: { user: TUser; id: number }) => {
              console.log("stop", id);

              store.dispatch(setUserStopTyping({ user, id }));
            }
          );
        }
      }
    }

    if (startListeningConversation.match(action) && socket) {
      const { id, type } = action.payload;
      const eventName = type + "" + id;
      socket.socket.off(eventName);
      socket.socket.off(eventName + "typing");
      socket.socket.off(eventName + "stop-typing");
      console.log(eventName + "stop-typing");
      socket.socket.on(eventName, (message) => {
        store.dispatch(reciveMessage(message.message));
      });
      console.log(eventName + "typing");
      socket.socket.on(eventName + "typing", (user) => {
        store.dispatch(setUserTypingConversation(user));
      });
      socket.socket.on(eventName + "stop-typing", (user) => {
        store.dispatch(setUserStopTypingConversation(user));
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
    if (startTyping.match(action) && socket) {
      socket.socket.emit(SocketEvent.UserTyping, action.payload);
    }

    if (stopTyping.match(action) && socket) {
      socket.socket.emit(SocketEvent.UserStopTyping, action.payload);
    }
    next(action);
  };
};

export default socketMiddleware;
