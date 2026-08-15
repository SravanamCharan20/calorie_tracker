import Meal from "../../models/meal.model.js";

// Single place to create meals — used by REST API, chat tools, and PDF import.
const mealTypes = ["breakfast", "lunch", "dinner", "snacks"];

// Strips text like "100g" or "1 serving" down to a number when possible.
const toNumber = (value) => {
  if (typeof value === "number") {
    return value;
  }

  return Number(String(value).replace(/[^\d.-]/g, ""));
};

const createMeal = async ({
  userId,
  mealType,
  foodName,
  quantity,
  calories,
  protein,
  carbs,
  fat,
  micronutrients = {},
  consumedAt,
}) => {
  if (!userId) {
    throw new Error("User is required");
  }

  const name = String(foodName ?? "").trim();

  if (!name) {
    throw new Error("Food name is required");
  }

  const type = String(mealType ?? "").toLowerCase().trim();

  if (!mealTypes.includes(type)) {
    throw new Error("Meal type must be breakfast, lunch, dinner, or snacks");
  }

  const fields = { quantity, calories, protein, carbs, fat };

  for (const [field, value] of Object.entries(fields)) {
    if (value == null || value === "") {
      throw new Error(`${field} is required`);
    }

    const num = toNumber(value);

    if (!Number.isFinite(num) || num < 0) {
      throw new Error(`${field} must be a valid number`);
    }

    fields[field] = num;
  }

  const microFields = {
    iron: micronutrients.iron,
    calcium: micronutrients.calcium,
    vitaminC: micronutrients.vitaminC,
    vitaminD: micronutrients.vitaminD,
  };

  const parsedMicronutrients = {};

  for (const [field, value] of Object.entries(microFields)) {
    if (value == null || value === "") {
      parsedMicronutrients[field] = 0;
      continue;
    }

    const num = toNumber(value);

    if (!Number.isFinite(num) || num < 0) {
      throw new Error(`${field} must be a valid non-negative number`);
    }

    parsedMicronutrients[field] = num;
  }

  return Meal.create({
    userId,
    mealType: type,
    foodName: name,
    quantity: fields.quantity,
    calories: fields.calories,
    protein: fields.protein,
    carbs: fields.carbs,
    fat: fields.fat,
    micronutrients: parsedMicronutrients,
    consumedAt: consumedAt || undefined,
  });
};

export default createMeal;
