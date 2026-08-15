import api from "./api";

export const getGoal = async () => {
  return await api("/goals/get");
};

export const updateGoal = async (goalData) => {
  return await api("/goals/update", {
    method: "PATCH",
    body: JSON.stringify(goalData),
  });
};
