import api from "./api";

export const sendChatMessage = async (message) => {
  return await api("/chat", {
    method: "POST",
    body: JSON.stringify({ message }),
  });
};
