import { Middleware } from "redux";
// Actions
import {
  connectionEstablished,
  initSocket,
  connectionLost,
} from "./slices/socketSlice";
import SocketFactory, { SocketInterface } from "./SocketFactory";
import {
  confirmMessage,
  emitMessage,
  reciveMessage,
  startListeningCofirmationMessage,
  startListeningConversation,
  stopListeningConversation,
} from "./slices/conversationSlice";
import {
  createRoom,
  getUsers,
  joinRoom,
  reciveGlobalMessage,
  setActiveUsers,
  setUsers,
  stopListeningUser,
  updateConversation,
  updateUser,
} from "./slices/instancesSlice";
import { IConversation } from "../types/messages";

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
}

const socketMiddleware: Middleware = (store) => {
  let socket: SocketInterface;
  return (next) => (action) => {
    if (initSocket.match(action)) {
      if (!socket) {
        const token: string = store.getState().auth.token;
        socket = SocketFactory.create(token);
        socket.socket.connect();

        socket.socket.on(SocketEvent.Connect, () => {
          console.log("connected");
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
            socket.socket.emit("joinRoom", conversation.childId);
          }
        );
        socket.socket.on(SocketEvent.Disconnect, (reason) => {
          console.log("disconnected");
          store.dispatch(connectionLost());
        });
      }
    }

    if (getUsers.match(action) && socket) {
      socket.socket.off(SocketEvent.ActiveUsers);
      socket.socket.off(SocketEvent.Users);
      socket.socket.off(SocketEvent.User);

      socket.socket.on(SocketEvent.ActiveUsers, (message) => {
        console.log(message);
        store.dispatch(setActiveUsers(message));
      });
      socket.socket.on(SocketEvent.Users, (message) => {
        console.log(message);
        store.dispatch(setUsers(message));
      });
      socket.socket.on(SocketEvent.User, (message) => {
        store.dispatch(updateUser(message));
      });
      setTimeout(() => socket.socket.emit(SocketEvent.getUsers), 100);
    }

    if (startListeningConversation.match(action) && socket) {
      const { id, type } = action.payload;
      socket.socket.off(type + "" + id);
      console.log(type + "" + id);
      socket.socket.on(type + "" + id, (message) => {
        console.log(message);
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
      console.log(SocketEvent.getUsers);
      socket.socket.off(SocketEvent.ActiveUsers);
    }

    if (emitMessage.match(action) && socket) {
      socket.socket.emit(SocketEvent.sendMessage, action.payload);
    }

    if (createRoom.match(action) && socket) {
      socket.socket.emit(SocketEvent.CreateRoom, action.payload);
    }

    next(action);
  };
};

export default socketMiddleware;
