import Goal from "../../models/goal.model.js";

const getGoal = async (userId) => {
  let goal = await Goal.findOne({ userId });

  if (!goal) {
    goal = await Goal.create({ userId });
  }

  return goal;
};

export default getGoal;
