export const calcLastActive = (userLastActive: Date | undefined) => {
  const lastActive = userLastActive
    ? new Date().getTime() - new Date(userLastActive).getTime()
    : null;
  if (!lastActive) return null;
  const minutes = Math.floor(lastActive / 1000 / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (days > 0) return `${days} days ago`;
  else if (hours > 0) return `${hours} hours ago`;
  else return `${minutes} minutes ago`;
};
