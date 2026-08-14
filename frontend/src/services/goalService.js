import api from "./api";

export const getGoal = async () => {
  return await api("/goals/get");
};

export const getGoalSafe = async () => {
  try {
    return await getGoal();
  } catch (error) {
    if (error.message === "Goal data not found") {
      return { goal: null };
    }
    throw error;
  }
};

export const updateGoal = async (goalData) => {
  return await api("/goals/update", {
    method: "PATCH",
    body: JSON.stringify(goalData),
  });
};
