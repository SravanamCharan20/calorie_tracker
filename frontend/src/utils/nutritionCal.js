import {
  getLocalDateKey,
  getLocalDayOffset,
} from "./dateUtils.js";

export const roundNutritionValue = (value, decimals = 1) => {
  const numeric = Number(value);

  if (!Number.isFinite(numeric)) {
    return 0;
  }

  const factor = 10 ** decimals;
  return Math.round((numeric + Number.EPSILON) * factor) / factor;
};

export const formatNutritionValue = (value, decimals = 1) => {
  const rounded = roundNutritionValue(value, decimals);
  return parseFloat(rounded.toFixed(decimals)).toString();
};

export const formatCalories = (value) => formatNutritionValue(value, 0);
export const formatGrams = (value) => formatNutritionValue(value, 1);

export const calculateNutritionTotals = (meals) => {
  const totals = meals.reduce(
    (totals, meal) => {
      totals.calories += meal.calories;
      totals.protein += meal.protein;
      totals.carbs += meal.carbs;
      totals.fat += meal.fat;

      return totals;
    },
    {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
    },
  );

  return {
    calories: roundNutritionValue(totals.calories, 0),
    protein: roundNutritionValue(totals.protein, 1),
    carbs: roundNutritionValue(totals.carbs, 1),
    fat: roundNutritionValue(totals.fat, 1),
  };
};

export const calculateNutritionProgress = (totals, goal) => {
  const caloriesRemaining = roundNutritionValue(
    Math.max(goal.dailyCalorieTarget - totals.calories, 0),
    0,
  );

  const proteinRemaining = roundNutritionValue(
    Math.max(goal.proteinTarget - totals.protein, 0),
    1,
  );

  const carbsRemaining = roundNutritionValue(
    Math.max(goal.carbTarget - totals.carbs, 0),
    1,
  );

  const fatRemaining = roundNutritionValue(
    Math.max(goal.fatTarget - totals.fat, 0),
    1,
  );

  const caloriePercentage = Math.min(
    (totals.calories / goal.dailyCalorieTarget) * 100,
    100,
  );

  const proteinPercentage = Math.min(
    (totals.protein / goal.proteinTarget) * 100,
    100,
  );

  const carbPercentage = Math.min((totals.carbs / goal.carbTarget) * 100, 100);

  const fatPercentage = Math.min((totals.fat / goal.fatTarget) * 100, 100);

  return {
    caloriesRemaining,
    proteinRemaining,
    carbsRemaining,
    fatRemaining,

    caloriePercentage,
    proteinPercentage,
    carbPercentage,
    fatPercentage,
  };
};

export const calculateWeeklyCalories = (meals) => {
  const today = new Date();
  const weeklyCalories = [];

  // Build the last 7 days using local dates so the chart matches what the user sees.
  for (let i = 6; i >= 0; i--) {
    const date = getLocalDayOffset(-i, today);
    const dateKey = getLocalDateKey(date);

    const calories = meals
      .filter(
        (meal) => getLocalDateKey(new Date(meal.consumedAt)) === dateKey,
      )
      .reduce((total, meal) => total + meal.calories, 0);

    weeklyCalories.push({
      date: dateKey,
      day: date.toLocaleDateString("en-US", {
        weekday: "short",
      }),
      calories,
    });
  }

  return weeklyCalories;
};


  export const calculateMacroDistribution = (meals) => {
    const totals = meals.reduce(
      (totals, meal) => {
        totals.protein += meal.protein;
        totals.carbs += meal.carbs;
        totals.fat += meal.fat;
  
        return totals;
      },
      {
        protein: 0,
        carbs: 0,
        fat: 0,
      },
    );

    return {
      protein: roundNutritionValue(totals.protein, 1),
      carbs: roundNutritionValue(totals.carbs, 1),
      fat: roundNutritionValue(totals.fat, 1),
    };
  };


  export const calculateMacroPercentages = (macroDistribution) => {
    const total =
      macroDistribution.protein +
      macroDistribution.carbs +
      macroDistribution.fat;
  
    if (total === 0) {
      return {
        protein: 0,
        carbs: 0,
        fat: 0,
      };
    }
  
    return {
      protein: (macroDistribution.protein / total) * 100,
      carbs: (macroDistribution.carbs / total) * 100,
      fat: (macroDistribution.fat / total) * 100,
    };
  };

  export const formatRecentMeals = (meals) => {
    return meals.map((meal) => ({
      id: meal._id,
      foodName: meal.foodName,
      mealType: meal.mealType,
      quantity: meal.quantity,
      calories: meal.calories,
      protein: meal.protein,
      carbs: meal.carbs,
      fat: meal.fat,
      consumedAt: meal.consumedAt,
    }));
  };

export const calculateWeeklyMacros = (meals) => {
  const today = new Date();
  const weeklyMacros = [];

  for (let i = 6; i >= 0; i--) {
    const date = getLocalDayOffset(-i, today);
    const dateKey = getLocalDateKey(date);

    const dayMeals = meals.filter(
      (meal) => getLocalDateKey(new Date(meal.consumedAt)) === dateKey,
    );

    const macros = calculateMacroDistribution(dayMeals);

    weeklyMacros.push({
      date: dateKey,
      day: date.toLocaleDateString("en-US", { weekday: "short" }),
      ...macros,
    });
  }

  return weeklyMacros;
};

export const calculateMicronutrientTotals = (meals) => {
  return meals.reduce(
    (totals, meal) => {
      const micro = meal.micronutrients ?? {};

      totals.iron += micro.iron ?? 0;
      totals.calcium += micro.calcium ?? 0;
      totals.vitaminC += micro.vitaminC ?? 0;
      totals.vitaminD += micro.vitaminD ?? 0;

      return totals;
    },
    {
      iron: 0,
      calcium: 0,
      vitaminC: 0,
      vitaminD: 0,
    },
  );
};

export const MICRONUTRIENT_REFERENCES = {
  iron: { label: "Iron", unit: "mg", target: 18 },
  calcium: { label: "Calcium", unit: "mg", target: 1000 },
  vitaminC: { label: "Vitamin C", unit: "mg", target: 90 },
  vitaminD: { label: "Vitamin D", unit: "IU", target: 600 },
};

export const calculateGoalComparison = (totals, goal) => {
    return {
      calories: {
        target: goal.dailyCalorieTarget,
        actual: totals.calories,
        remaining: roundNutritionValue(
          Math.max(goal.dailyCalorieTarget - totals.calories, 0),
          0,
        ),
      },
  
      protein: {
        target: goal.proteinTarget,
        actual: totals.protein,
        remaining: roundNutritionValue(
          Math.max(goal.proteinTarget - totals.protein, 0),
          1,
        ),
      },
  
      carbs: {
        target: goal.carbTarget,
        actual: totals.carbs,
        remaining: roundNutritionValue(
          Math.max(goal.carbTarget - totals.carbs, 0),
          1,
        ),
      },
  
      fat: {
        target: goal.fatTarget,
        actual: totals.fat,
        remaining: roundNutritionValue(
          Math.max(goal.fatTarget - totals.fat, 0),
          1,
        ),
      },
    };
  };