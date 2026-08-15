import api from "./api";

export const extractNutrition = async (imageFile) => {
  const formData = new FormData();
  formData.append("image", imageFile);

  return await api("/ai/extract", {
    method: "POST",
    body: formData,
  });
};
