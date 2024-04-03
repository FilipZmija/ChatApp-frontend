import {
  Avatar,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { IConversation } from "../../types/messages";
import { selectUser } from "../../redux/slices/instancesSlice";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../redux/hooks";

export default function ConversationItem({
  conversation,
}: {
  conversation: IConversation;
}) {
  const dispatch = useDispatch();
  const selectedUser = useAppSelector((state) => state.instance.selection);
  const { id: currentUserId } = useAppSelector((state) => state.auth);
  return (
    <div style={{ overflow: "hidden" }}>
      <ListItemButton
        key={conversation.id}
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
        selected={selectedUser.id === conversation.childId}
        divider
      >
        <ListItemAvatar sx={{ marginRight: "0.5rem" }}>
          <Avatar
            sx={{
              bgcolor: conversation ? "green" : "red",
              width: "3.5rem",
              height: "3.5rem",
            }}
          >
            {conversation.name?.charAt(0).toUpperCase() || "R"}
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={conversation.name}
          secondary={
            conversation.lastMessage ? (
              <>
                {conversation.lastMessage.user.id === currentUserId ? (
                  <span style={{ color: "blue" }}>You: </span>
                ) : (
                  conversation.type === "room" && (
                    <span style={{ color: "green" }}>
                      {conversation.lastMessage.user.name}:{" "}
                    </span>
                  )
                )}
                {conversation.lastMessage.content.length > 20 ? (
                  <>{conversation.lastMessage.content.slice(0, 20)}...</>
                ) : (
                  conversation.lastMessage.content
                )}
                {conversation.lastMessage.status == "seen" && (
                  <span style={{ color: "red" }}> (Unread)</span>
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
          sx={{ color: conversation ? "green" : "red" }}
        />
      </ListItemButton>
    </div>
  );
}
