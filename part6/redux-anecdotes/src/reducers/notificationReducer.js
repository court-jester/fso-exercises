const notificationReducer = (state = "", action) => {
  switch (action.type) {
    case "SET_NOTIFICATION":
      return action.message;

    case "UNSET_NOTIFICATION":
      return "";

    default:
      return state;
  }
};

export const setNotification = (message) => {
  return {
    type: "SET_NOTIFICATION",
    message,
  };
};

export const unsetNotification = () => {
  return {
    type: "UNSET_NOTIFICATION",
    data: {
      message: "",
    },
  };
};

export default notificationReducer;
