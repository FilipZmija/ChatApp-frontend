import React from "react";
import CustomAvatar from "./CustomAvatar";
import { calcLastActive } from "../../helpers/time";
import { TUser } from "../../types/user";

export default function UserCard({ user }: { user: TUser }) {
  return (
    <div className="user-list-item-container">
      <CustomAvatar className="avatar" coversationData={user}></CustomAvatar>
      <div className="user-list-item-info">
        <h3>{user.name}</h3>
        <h5>
          {user?.active
            ? "Online"
            : `Active ${calcLastActive(user.lastActive)}`}
        </h5>
      </div>
    </div>
  );
}
