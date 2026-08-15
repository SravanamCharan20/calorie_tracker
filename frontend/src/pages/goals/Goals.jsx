/* eslint-disable react-hooks/set-state-in-effect */
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../utils/AuthContext.jsx";
import { getGoal, updateGoal } from "../../services/goalService.js";
import DashboardLayout from "../../components/dashboard/DashboardLayout.jsx";
import Header from "../../components/dashboard/Header.jsx";
import GoalsForm from "../../components/goals/GoalsForm.jsx";

const defaultForm = {
  dailyCalorieTarget: "2200",
  proteinTarget: "150",
  carbTarget: "250",
  fatTarget: "70",
  weightGoal: "65",
};

const emptyForm = {
  dailyCalorieTarget: "",
  proteinTarget: "",
  carbTarget: "",
  fatTarget: "",
  weightGoal: "",
};

const goalFieldLabels = {
  dailyCalorieTarget: "Daily calories",
  proteinTarget: "Protein",
  carbTarget: "Carbohydrates",
  fatTarget: "Fat",
  weightGoal: "Weight goal",
};

const validateGoalForm = (form) => {
  for (const [key, label] of Object.entries(goalFieldLabels)) {
    const rawValue = form[key].trim();

    if (rawValue === "") {
      return `${label} is required.`;
    }

    const value = Number(rawValue);

    if (!Number.isFinite(value) || value < 0) {
      return `${label} must be a valid non-negative number.`;
    }
  }

  return null;
};

const Goals = () => {
  const { isAuthenticated } = useAuth();

  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchGoal = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getGoal();
      const goal = response.goal;

      if (goal) {
        setForm({
          dailyCalorieTarget: String(goal.dailyCalorieTarget),
          proteinTarget: String(goal.proteinTarget),
          carbTarget: String(goal.carbTarget),
          fatTarget: String(goal.fatTarget),
          weightGoal: String(goal.weightGoal),
        });
      } else {
        setForm(defaultForm);
      }
    } catch (fetchError) {
      console.log("Goals error:", fetchError);
      setError(fetchError.message);
      setForm(defaultForm);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchGoal();
  }, [isAuthenticated, fetchGoal]);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const validationError = validateGoalForm(form);

    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSaving(true);

    try {
      await updateGoal({
        dailyCalorieTarget: Number(form.dailyCalorieTarget),
        proteinTarget: Number(form.proteinTarget),
        carbTarget: Number(form.carbTarget),
        fatTarget: Number(form.fatTarget),
        weightGoal: Number(form.weightGoal),
      });

      setSuccess("Goals updated successfully.");
    } catch (saveError) {
      console.log("Save goal error:", saveError);
      setError(saveError.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <Header title="Goals" />

      <section className="mb-6">
        <p className="text-sm text-muted">Personal targets</p>
        <h2 className="mt-1 text-xl font-bold tracking-tight text-white sm:text-2xl">
          Goals & preferences
        </h2>
      </section>

      {loading ? (
        <div className="space-y-4">
          <div className="h-80 animate-pulse rounded-2xl bg-card-elevated" />
          <div className="h-24 animate-pulse rounded-2xl bg-card-elevated" />
        </div>
      ) : (
        <>
          <GoalsForm
            form={form}
            onChange={handleChange}
            onSubmit={handleSubmit}
            isSaving={isSaving}
            error={error}
            success={success}
          />

          <article className="mt-6 flex items-start gap-4 rounded-2xl border border-border bg-card p-6">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-card-elevated text-muted">
              <TargetIcon />
            </div>
            <div>
              <p className="font-medium text-white">Your goal is within reach</p>
              <p className="mt-1 text-sm leading-relaxed text-muted">
                Based on your current targets, staying consistent with your
                protein goal will be the biggest lever for progress.
              </p>
            </div>
          </article>
        </>
      )}
    </DashboardLayout>
  );
};

const TargetIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="12" cy="12" r="1" fill="currentColor" />
  </svg>
);

export default Goals;
