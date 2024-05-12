export const timeDifference = (timestamp) => {
  const now = new Date();
  const previous = new Date(timestamp);
  const difference = now.getTime() - previous.getTime();
  const minutes = Math.round(difference / 60000); // Convert milliseconds to minutes

  if (minutes < 60) {
    return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
  } else if (minutes < 1440) {
    const hours = Math.floor(minutes / 60);
    return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  } else {
    const days = Math.floor(minutes / 1440);
    return `${days} day${days !== 1 ? "s" : ""} ago`;
  }
};
