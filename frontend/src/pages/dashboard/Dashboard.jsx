/* eslint-disable react-hooks/set-state-in-effect */
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../utils/AuthContext.jsx";
import { getGoalSafe } from "../../services/goalService.js";
import { getMeals } from "../../services/mealService.js";
import {
  getStartOfLocalDay,
  getEndOfLocalDay,
  getLocalDayOffset,
} from "../../utils/dateUtils.js";
import {
  calculateNutritionTotals,
  calculateNutritionProgress,
  calculateWeeklyCalories,
  calculateWeeklyMacros,
  calculateMacroDistribution,
  calculateMacroPercentages,
  calculateMicronutrientTotals,
  calculateGoalComparison,
  formatRecentMeals,
} from "../../utils/nutritionCal.js";
import DashboardLayout from "../../components/dashboard/DashboardLayout.jsx";
import Header from "../../components/dashboard/Header.jsx";
import WelcomeSection from "../../components/dashboard/WelcomeSection.jsx";
import NutritionSummary from "../../components/dashboard/NutritionSummary.jsx";
import WeeklyCaloriesChart from "../../components/dashboard/WeeklyCaloriesChart.jsx";
import MacroBreakdown from "../../components/dashboard/MacroBreakdown.jsx";
import MicronutrientSummary from "../../components/dashboard/MicronutrientSummary.jsx";
import GoalComparison from "../../components/dashboard/GoalComparison.jsx";
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

      const startOfToday = getStartOfLocalDay();
      const endOfToday = getEndOfLocalDay();
      const startOfWeek = getLocalDayOffset(-6);

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

  const weeklyMacros = calculateWeeklyMacros(weeklyMeals);

  const micronutrientTotals = calculateMicronutrientTotals(meals);

  const goalComparison = goal
    ? calculateGoalComparison(nutritionTotals, goal)
    : null;

  const recentMeals = formatRecentMeals(meals);

  return (
    <DashboardLayout>
      <Header title="Dashboard" />
      <WelcomeSection username={user.username} />

      <section className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <NutritionSummary
          nutritionTotals={nutritionTotals}
          nutritionProgress={nutritionProgress}
          goal={goal}
        />
        <GoalComparison goalComparison={goalComparison} />
      </section>

      <section className="mb-6 grid grid-cols-1 gap-4 xl:grid-cols-5">
        <div className="xl:col-span-3">
          <WeeklyCaloriesChart
            weeklyCalories={weeklyCalories}
            calorieTarget={goal?.dailyCalorieTarget ?? 0}
          />
        </div>
        <div className="xl:col-span-2">
          <MacroBreakdown
            dailyMacros={macroDistribution}
            dailyPercentages={macroPercentages}
            weeklyMacros={weeklyMacros}
          />
        </div>
      </section>

      <section className="mb-6">
        <MicronutrientSummary micronutrients={micronutrientTotals} />
      </section>

      <RecentMeals recentMeals={recentMeals} />
    </DashboardLayout>
  );
};

export default Dashboard;
