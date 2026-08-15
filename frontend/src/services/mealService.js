import api from "./api";

export const createMeal = async (mealData) => {
  return await api("/meals/create", {
    method: "POST",
    body: JSON.stringify(mealData),
  });
};

export const getMeals = async (params = {}) => {
  const query = new URLSearchParams();

  if (params.startDate) {
    query.append("startDate", params.startDate);
  }

  if (params.endDate) {
    query.append("endDate", params.endDate);
  }

  if (params.mealType) {
    query.append("mealType", params.mealType);
  }

  if (params.search?.trim()) {
    query.append("search", params.search.trim());
  }

  query.append("page", String(params.page ?? 1));
  query.append("limit", String(params.limit ?? 5));

  const queryString = query.toString();

  return await api(
    `/meals/get${queryString ? `?${queryString}` : ""}`,
  );
};

export const getMeal = async (mealId) => {
  return await api(`/meals/get/${mealId}`);
};

export const updateMeal = async (mealId, mealData) => {
  return await api(`/meals/update/${mealId}`, {
    method: "PATCH",
    body: JSON.stringify(mealData),
  });
};

export const deleteMeal = async (mealId) => {
  return await api(`/meals/delete/${mealId}`, {
    method: "DELETE",
  });
};

export const importMealsFromPdf = async (pdfFile) => {
  const formData = new FormData();
  formData.append("pdf", pdfFile);

  return await api("/meals/import/pdf", {
    method: "POST",
    body: formData,
  });
};