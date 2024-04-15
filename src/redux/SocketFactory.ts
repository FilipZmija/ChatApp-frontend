"use client";
import { io, Socket } from "socket.io-client";

export interface SocketInterface {
  socket: Socket;
}

class SocketConnection implements SocketInterface {
  public socket: Socket;
  constructor(token: string) {
    this.socket = io(`${process.env.REACT_APP_API_URL}`, {
      reconnectionDelayMax: 10000,
      autoConnect: false,
      auth: {
        token,
      },
    });
  }
}
let socketConnection: SocketConnection | undefined;

class SocketFactory {
  public static create(token: string): SocketConnection {
    if (!socketConnection) {
      socketConnection = new SocketConnection(token);
    }
    return socketConnection;
  }
}
export const closeSocketConnection = () => {
  if (socketConnection) {
    socketConnection.socket.close();
    socketConnection = undefined;
  }
};

export default SocketFactory;
