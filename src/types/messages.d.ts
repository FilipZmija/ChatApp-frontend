import { TUser, TRoom } from "./user";

export interface ISingleMessage {
  createdAt: string;
  content: string;
  id: number | null;
  userId: number;
  user: TUser;

  type: "message" | "system";
  status?: "sent" | "delivered" | "seen";
}

export interface IConversation {
  id: number;
  childId: number;
  name?: string;
  lastMessage?: ISingleMessage;
  messages?: ISingleMessage[];
  users: TUser[];
  type: "user" | "room";
}

export interface IConversationCard {
  id: number;
  childId: number;
  name?: string;
  lastMessage?: ISingleMessage;
  recipient?: TUser | TRoom;
  usersIds?: number[];
  type: "user" | "room";
}

export interface IConversationData {
  recipient: TUser | TRoom;
  conversation: IConversation;
  loading?: boolean;
}

export interface IMessage {
  to: IConversation | null;
  message: ISingleMessage;
}

export class IMessageToSocket extends IMessage {
  to: IConversation;
  message: ISingleMessage;
}

export interface IMessageCreator {
  message:
    | ISingleMessage
    | {
        id: number;
        content: string;
        status: string;
        user: TUser;
        createdAt: string;
      };
  type: "first" | "middle" | "last" | "single";
  messageSender: string;
  nextMessageSender: string | null;
  timeDifferenceBack: number;
}
