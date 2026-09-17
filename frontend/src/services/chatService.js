import api from "./api";

export const sendChatMessage = async (message, imageFile) => {
  if (imageFile) {
    const formData = new FormData();
    formData.append("message", message);
    formData.append("image", imageFile);

    return await api("/chat", {
      method: "POST",
      body: formData,
    });
  }

  return await api("/chat", {
    method: "POST",
    body: JSON.stringify({ message }),
  });
};
