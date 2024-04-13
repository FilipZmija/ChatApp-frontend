import React, { useEffect, useState } from "react";
import { TUser } from "../../types/user";
import { TRoom } from "../../types/room";
import { calcLastActive } from "../../helpers/time";
import "./ConvStyle/Badge.css";
import CustomAvatar from "../Users/CustomAvatar";
import ConversationUsersList from "./ConversationUsersList";

export default function Badge({ recipient }: { recipient: TUser | TRoom }) {
  const [timeActive, setTimeActive] = useState<string | null>();
  useEffect(() => {
    setTimeActive(calcLastActive(recipient.lastActive));
    const interval = setInterval(() => {
      setTimeActive(calcLastActive(recipient.lastActive));
    }, 1000 * 60);
    return () => {
      clearInterval(interval);
    };
  }, [recipient.lastActive]);

  return (
    <div className="badge-container">
      {recipient.id !== 0 ? (
        <>
          <CustomAvatar className={`avatar`} coversationData={recipient} />
          <div className="user-info">
            <h2>{recipient.name}</h2>
            {recipient.active ? <p>Online</p> : <p>Active {timeActive}</p>}
          </div>
        </>
      ) : (
        <h1>Welcome to Filip's Chat App!</h1>
      )}
      {recipient.type === "room" && (
        <div className="convrsation-users-list-container">
          <ConversationUsersList />
        </div>
      )}
    </div>
  );
}
