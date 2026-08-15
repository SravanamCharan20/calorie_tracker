import Meal from "../../models/meal.model.js";

const createMeal = async ({
  userId,
  mealType,
  foodName,
  quantity,
  calories,
  protein,
  carbs,
  fat,
  micronutrients,
  consumedAt,
}) => {
  if (
    !mealType ||
    !foodName ||
    quantity == null ||
    calories == null ||
    protein == null ||
    carbs == null ||
    fat == null
  ) {
    throw new Error("All meal fields are required");
  }

  const meal = await Meal.create({
    userId,
    mealType,
    foodName,
    quantity,
    calories,
    protein,
    carbs,
    fat,
    micronutrients,
    consumedAt,
  });

  return meal;
};

export default createMeal;