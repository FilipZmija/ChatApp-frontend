export const calcLastActive = (
  userLastActive: string | undefined,
  string = true
) => {
  const lastActive = userLastActive
    ? new Date().getTime() - new Date(userLastActive).getTime()
    : null;
  if (!lastActive) return string ? `${0} minutes ago` : "0";
  const minutes = Math.floor(lastActive / 1000 / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (days > 0) return string ? `${days} days ago` : `${days} d`;
  else if (hours > 0) return string ? `${hours} hours ago` : `${hours} h`;
  else return string ? `${minutes} minutes ago` : `${minutes} m`;
};
