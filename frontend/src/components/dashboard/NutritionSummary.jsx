import CaloriesHeroCard from "./CaloriesHeroCard";

const NutritionSummary = ({ nutritionTotals, nutritionProgress, goal }) => {
  if (!goal || !nutritionProgress) {
    return null;
  }

  return (
    <CaloriesHeroCard
      consumed={nutritionTotals.calories}
      target={goal.dailyCalorieTarget}
      remaining={nutritionProgress.caloriesRemaining}
      percentage={nutritionProgress.caloriePercentage}
    />
  );
};

export default NutritionSummary;
