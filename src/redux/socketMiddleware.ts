import { Middleware } from "redux";
// Actions
import {
  connectionEstablished,
  initSocket,
  connectionLost,
} from "./slices/socketSlice";
import SocketFactory, { SocketInterface } from "./SocketFactory";
import {
  emitMessage,
  reciveMessage,
  startListeningConversation,
} from "./slices/conversationSlice";
import {
  createRoom,
  getUsers,
  joinRoom,
  reciveGlobalMessage,
  setUsers,
  stopListeningUser,
} from "./slices/instancesSlice";

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
  Users = "users",
  getUsers = "getUsers",
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
        socket.socket.on(SocketEvent.JoinRoom, (conversation) => {
          store.dispatch(joinRoom(conversation));
        });
        socket.socket.on(SocketEvent.Disconnect, (reason) => {
          console.log("disconnected");
          store.dispatch(connectionLost());
        });
      }
    }

    if (getUsers.match(action) && socket) {
      socket.socket.off(SocketEvent.Users);
      socket.socket.on(SocketEvent.Users, (message) => {
        console.log(message);
        store.dispatch(setUsers(message));
      });
      console.log("here");
      socket.socket.emit(SocketEvent.getUsers);
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

    if (stopListeningUser.match(action) && socket) {
      console.log(SocketEvent.getUsers);

      socket.socket.off(SocketEvent.Users);
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
