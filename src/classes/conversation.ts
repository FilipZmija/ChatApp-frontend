import {
  IMessageToSocket,
  ISingleMessage,
  IConversation,
} from "../types/messages";
import { TRoom } from "../types/room";
import { TUser } from "../types/user";

export class MessageEmitter implements IMessageToSocket {
  to: IConversation;
  message: ISingleMessage;

  constructor(
    conversation: IConversation | null,
    messageContent: string,
    userId: number,
    recipient: TUser | TRoom,
    sender: TUser
  ) {
    this.message = {
      type: "message",
      content: messageContent,
      id: null,
      userId,
      createdAt: new Date().toString(),
      user: sender,
      status: "sent",
    };
    if (!conversation) {
      this.to = {
        id: 0,
        childId: recipient.id,
        type: "user",
        name: recipient.name,
        users: [],
        typing: [],
      };
    } else {
      this.to =
        conversation.type === "user"
          ? {
              id: conversation.id,
              childId: recipient.id,
              type: "user",
              users: conversation.users,
              typing: [],
            }
          : {
              id: conversation.id,
              childId: recipient.id,
              name: conversation.name,
              type: "room",
              users: conversation.users,
              typing: [],
            };
    }
  }
  get body(): IMessageToSocket {
    return { to: this.to, message: this.message };
  }
}
