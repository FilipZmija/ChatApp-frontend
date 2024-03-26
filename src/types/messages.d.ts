import { TUser, TRoom } from "./user";

export interface ISingleMessage {
  createdAt: Date;
  content: string;
  id: number | null;
  userId: number;
  user: TUser;

  type: "message" | "system";
  status?: "sent" | "delivered" | "seen";
}

export interface IConversation {
  id: number | null;
  childId: number | null;
  name?: string;
  lastMessage?: ISingleMessage;
  messages?: ISingleMessage[];
  type: "user" | "room";
}

export interface IConversationData {
  recipient: TUser | TRoom;
  conversation: IConversation;
}

export interface IMessage {
  to: IConversation | null;
  message: ISingleMessage;
}

export class IMessageToSocket extends IMessage {
  to: IConversation;
  message: ISingleMessage;
}
