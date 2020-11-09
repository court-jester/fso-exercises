import React from "react";
import { useSelector } from "react-redux";

const Notification = () => {
  const notification = useSelector(({ notification }) => notification);
  const style = {
    border: "solid",
    padding: 10,
    borderWidth: 1,
  };

  // Only show the notification when it is defined
  return notification !== "" && <div style={style}>{notification}</div>;
};

export default Notification;
