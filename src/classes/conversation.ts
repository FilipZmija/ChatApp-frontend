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
      createdAt: new Date().getTime(),
      user: sender,
    };
    if (!conversation) {
      this.to = {
        id: 0,
        childId: recipient.id,
        type: "user",
        name: recipient.name,
      };
    } else {
      this.to =
        conversation.type === "user"
          ? {
              id: conversation.id,
              childId: recipient.id,
              type: "user",
            }
          : {
              id: conversation.id,
              childId: recipient.id,
              name: conversation.name,
              type: "room",
            };
    }
  }
  get body(): IMessageToSocket {
    return { to: this.to, message: this.message };
  }
}
