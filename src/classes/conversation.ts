import {
  IConversationRoom,
  IMessageToSocket,
  ISingleMessage,
  TConversation,
} from "../types/messages";

export class EmitMessage implements IMessageToSocket {
  to: TConversation;
  message: ISingleMessage;

  constructor(
    conversation: TConversation | null,
    messageContent: string,
    userId: number,
    recipientId: number
  ) {
    this.message = {
      type: "message",
      content: messageContent,
      id: null,
      userId,
    };
    if (!conversation) {
      this.to = { id: null, childId: recipientId, type: "user" };
    } else {
      this.to =
        conversation.type === "user"
          ? {
              id: conversation.id,
              childId: recipientId,
              type: "user",
            }
          : {
              id: conversation.id,
              childId: recipientId,
              name: conversation.name,
              type: "room",
            };
    }
  }
  get body(): IMessageToSocket {
    return { to: this.to, message: this.message };
  }
}
