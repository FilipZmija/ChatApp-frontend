import { Middleware } from "redux";
// Actions
import {
  connectionEstablished,
  initSocket,
  connectionLost,
} from "./slices/socketSlice";
import SocketFactory, { SocketInterface } from "./SocketFactory";
import {
  getUsers,
  setUsers,
  stopListeningUser,
} from "./slices/conversationSlice";

enum SocketEvent {
  Connect = "connect",
  Disconnect = "disconnect",
  // Emit events
  JoinRoom = "join-room",
  LeaveRoom = "leave-room",
  // On events
  Error = "err",
  Price = "price",
  Message = "message",
  Users = "users",
  getUsers = "getUsers",
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
          console.log(message);
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
      socket.socket.emit(SocketEvent.getUsers);
    }

    if (stopListeningUser.match(action) && socket) {
      socket.socket.off(SocketEvent.Users);
    }

    next(action);
  };
};

export default socketMiddleware;
