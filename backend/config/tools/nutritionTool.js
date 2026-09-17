import { extractNutritionFromImage } from "../nutritionHelper.js";

const getNutritionValues = async ({ imageBase64, mimeType }) => {
  return extractNutritionFromImage({ imageBase64, mimeType });
};

export default getNutritionValues;
