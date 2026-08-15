import Meal from "../../models/meal.model.js";

const getWeeklyMeals = async (userId) => {
  const endDate = new Date();
  endDate.setHours(23, 59, 59, 999);

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 6);
  startDate.setHours(0, 0, 0, 0);

  const meals = await Meal.find({
    userId,
    consumedAt: {
      $gte: startDate,
      $lte: endDate,
    },
  }).sort({ consumedAt: -1 });

  return meals;
};

export default getWeeklyMeals;