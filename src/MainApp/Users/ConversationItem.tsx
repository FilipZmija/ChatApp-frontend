import {
  Avatar,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { IConversationCard } from "../../types/messages";
import { selectUser } from "../../redux/slices/instancesSlice";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../redux/hooks";
import "./UsersStyle/ConversationItem.css";
import CustomAvatar from "./CustomAvatar";
export default function ConversationItem({
  conversation,
}: {
  conversation: IConversationCard;
}) {
  const dispatch = useDispatch();
  const selectedUser = useAppSelector((state) => state.instance.selection);
  const { id: currentUserId } = useAppSelector((state) => state.auth);
  const messageSeen =
    conversation.lastMessage?.userId !== currentUserId &&
    conversation?.lastMessage?.status !== "seen";
  return (
    <div className="conversation-list-item-container">
      <ListItemButton
        key={conversation?.id}
        onClick={() =>
          conversation.childId &&
          dispatch(
            selectUser({
              id: conversation.childId,
              type: conversation.type,
              name: conversation.name,
            })
          )
        }
        selected={
          selectedUser.type === conversation.type &&
          selectedUser.id === +conversation.childId
        }
        divider
      >
        <ListItemAvatar>
          {conversation.recipient ? (
            <CustomAvatar
              className="conversation-avatar"
              coversationData={conversation.recipient}
            />
          ) : (
            <Avatar className="conversation-avatar">
              {conversation.name?.charAt(0).toUpperCase() || "R"}
            </Avatar>
          )}
        </ListItemAvatar>
        <ListItemText
          primary={
            <span className={`${messageSeen && "message-unread"}`}>
              {conversation.name}
            </span>
          }
          secondary={
            conversation.lastMessage ? (
              <>
                {conversation.lastMessage.user.id === currentUserId ? (
                  <span className={`${messageSeen && "message-unread"}`}>
                    You:{" "}
                  </span>
                ) : (
                  conversation.type === "room" && (
                    <span className={`${messageSeen && "message-unread"}`}>
                      {conversation.lastMessage.user.name}:{" "}
                    </span>
                  )
                )}
                {conversation.lastMessage.content.length > 20 ? (
                  <span className={`${messageSeen && "message-unread"}`}>
                    {conversation.lastMessage.content.slice(0, 20)}...
                  </span>
                ) : (
                  <span className={`${messageSeen && "message-unread"}`}>
                    {conversation.lastMessage.content}
                  </span>
                )}
                {" • "}
                {new Date(
                  conversation.lastMessage?.createdAt
                ).toLocaleDateString() === new Date().toLocaleDateString() ? (
                  <>
                    {new Date(
                      conversation.lastMessage?.createdAt
                    ).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </>
                ) : (
                  <>
                    {new Date(
                      conversation.lastMessage?.createdAt
                    ).toLocaleDateString()}
                  </>
                )}
              </>
            ) : (
              "No messages"
            )
          }
        />
        <div className={`dot ${messageSeen && "message-unread"}`}></div>
      </ListItemButton>
    </div>
  );
}
