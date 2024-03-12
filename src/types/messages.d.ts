import { TUser, TRoom } from "./user";

export interface ISingleMessage {
  content: string;
  id: number | null;
  userId: number;
  type: "message" | "system";
}

export interface TConversation {
  id: number | null;
  childId: number;
  name?: string;
  messages?: ISingleMessage[];
  type: "user" | "room";
}

export interface IConversationData {
  recipient: TUser | TRoom;
  conversation: TConversation | null;
}

export interface IConversationRoom extends TConversation {
  users?: TUser[];
}

export interface IMessage {
  to: IConversationRecipeint | IConversationRoom | null;
  message: ISingleMessage;
}

export class IMessageToSocket extends IMessage {
  to: IConversationRecipeint | IConversationRoom;
  message: ISingleMessage;
}
