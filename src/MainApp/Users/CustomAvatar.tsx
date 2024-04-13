import React, { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import { calcLastActive } from "../../helpers/time";
import "./UsersStyle/CustomAvatar.css";
interface IActiveData {
  active?: boolean;
  lastActive?: string;
  name: string;
}

interface Props {
  coversationData: IActiveData;
  className: string;
  noText?: boolean;
}

const getAvatarContent = (coversationData: IActiveData): string | null => {
  if (coversationData?.active) {
    return null;
  } else {
    return calcLastActive(coversationData.lastActive, false);
  }
};

const CustomAvatar: React.FC<Props> = ({
  coversationData,
  className,
  noText = false,
}) => {
  const [timeActive, setTimeActive] = useState<string | null>();

  useEffect(() => {
    setTimeActive(getAvatarContent(coversationData));
    console.log(coversationData);

    const interval = setInterval(() => {
      setTimeActive(getAvatarContent(coversationData));
    }, 1000 * 60);

    return () => {
      clearInterval(interval);
    };
  }, [coversationData]);
  return (
    <div className="avatar-container">
      <Avatar className={className}>
        {coversationData.name?.charAt(0)}
        {coversationData?.active ? (
          <div className="avatar-online-indicator"></div>
        ) : noText ? (
          <div className="avatar-ofline-notext-indicator" />
        ) : (
          <div className="avatar-ofline-indicator">{timeActive}</div>
        )}
      </Avatar>
    </div>
  );
};

export default CustomAvatar;
