/* eslint-disable react-hooks/set-state-in-effect */
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../utils/AuthContext.jsx";
import { getGoalSafe } from "../../services/goalService.js";
import { getMeals } from "../../services/mealService.js";
import {
  calculateNutritionTotals,
  calculateNutritionProgress,
  calculateWeeklyCalories,
  calculateMacroDistribution,
  calculateMacroPercentages,
  formatRecentMeals,
} from "../../utils/nutritionCal.js";
import DashboardLayout from "../../components/dashboard/DashboardLayout.jsx";
import Header from "../../components/dashboard/Header.jsx";
import WelcomeSection from "../../components/dashboard/WelcomeSection.jsx";
import NutritionSummary from "../../components/dashboard/NutritionSummary.jsx";
import WeeklyCaloriesChart from "../../components/dashboard/WeeklyCaloriesChart.jsx";
import MacroDistribution from "../../components/dashboard/MacroDistribution.jsx";
import RecentMeals from "../../components/dashboard/RecentMeals.jsx";
import LoadingDashboard from "../../components/dashboard/LoadingDashboard.jsx";
import ErrorDashboard from "../../components/dashboard/ErrorDashboard.jsx";

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();

  const [goal, setGoal] = useState(null);
  const [meals, setMeals] = useState([]);
  const [weeklyMeals, setWeeklyMeals] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const today = new Date();

      const startOfToday = new Date(today);
      startOfToday.setHours(0, 0, 0, 0);

      const endOfToday = new Date(today);
      endOfToday.setHours(23, 59, 59, 999);

      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - 6);
      startOfWeek.setHours(0, 0, 0, 0);

      const [goalResponse, todayMealsResponse, weeklyMealsResponse] =
        await Promise.all([
          getGoalSafe(),
          getMeals({
            startDate: startOfToday.toISOString(),
            endDate: endOfToday.toISOString(),
            limit: 100,
          }),
          getMeals({
            startDate: startOfWeek.toISOString(),
            endDate: endOfToday.toISOString(),
            limit: 100,
          }),
        ]);

      setGoal(goalResponse.goal);
      setMeals(todayMealsResponse.meals);
      setWeeklyMeals(weeklyMealsResponse.meals);
    } catch (fetchError) {
      console.log("Dashboard error:", fetchError);
      setError(fetchError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    fetchDashboardData();
  }, [isAuthenticated, fetchDashboardData]);

  if (loading) {
    return <LoadingDashboard />;
  }

  if (error) {
    return <ErrorDashboard error={error} onRetry={fetchDashboardData} />;
  }

  const nutritionTotals = calculateNutritionTotals(meals);

  const nutritionProgress = goal
    ? calculateNutritionProgress(nutritionTotals, goal)
    : null;

  const weeklyCalories = calculateWeeklyCalories(weeklyMeals);

  const macroDistribution = calculateMacroDistribution(meals);

  const macroPercentages = calculateMacroPercentages(macroDistribution);

  const recentMeals = formatRecentMeals(meals);

  return (
    <DashboardLayout>
      <Header title="Dashboard" />
      <WelcomeSection username={user.username} />

      <NutritionSummary
        nutritionTotals={nutritionTotals}
        nutritionProgress={nutritionProgress}
        goal={goal}
      />

      <section className="mb-6 grid grid-cols-1 gap-4 xl:grid-cols-5">
        <div className="xl:col-span-3">
          <WeeklyCaloriesChart
            weeklyCalories={weeklyCalories}
            calorieTarget={goal?.dailyCalorieTarget ?? 0}
          />
        </div>
        <div className="xl:col-span-2">
          <MacroDistribution
            macroPercentages={macroPercentages}
            totalCalories={nutritionTotals.calories}
          />
        </div>
      </section>

      <RecentMeals recentMeals={recentMeals} />
    </DashboardLayout>
  );
};

export default Dashboard;
