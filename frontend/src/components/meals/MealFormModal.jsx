import { useState } from "react";

const mealTypes = [
  { label: "Breakfast", value: "breakfast" },
  { label: "Lunch", value: "lunch" },
  { label: "Dinner", value: "dinner" },
  { label: "Snack", value: "snacks" },
];

const emptyForm = {
  mealType: "breakfast",
  foodName: "",
  quantity: "",
  calories: "",
  protein: "",
  carbs: "",
  fat: "",
};

const getInitialForm = (meal) => {
  if (!meal) return emptyForm;

  return {
    mealType: meal.mealType,
    foodName: meal.foodName,
    quantity: String(meal.quantity),
    calories: String(meal.calories),
    protein: String(meal.protein),
    carbs: String(meal.carbs),
    fat: String(meal.fat),
  };
};

const MealFormModal = ({ meal, onClose, onSave, isSaving }) => {
  const [form, setForm] = useState(() => getInitialForm(meal));

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      mealType: form.mealType,
      foodName: form.foodName,
      quantity: Number(form.quantity),
      calories: Number(form.calories),
      protein: Number(form.protein),
      carbs: Number(form.carbs),
      fat: Number(form.fat),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="meal-form-title"
        className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 sm:p-7"
      >
        <h2 id="meal-form-title" className="text-lg font-semibold text-white">
          {meal ? "Edit meal" : "Add meal"}
        </h2>
        <p className="mt-1 text-sm text-muted">
          {meal ? "Update the meal details below." : "Log a new meal to your diary."}
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <FormField label="Meal type">
            <select
              value={form.mealType}
              onChange={handleChange("mealType")}
              required
              className="w-full rounded-xl border border-border bg-card-elevated px-4 py-3 text-sm text-white outline-none focus:border-border-focus"
            >
              {mealTypes.map(({ label, value }) => (
                <option key={value} value={value} className="bg-card">
                  {label}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Food name">
            <input
              type="text"
              value={form.foodName}
              onChange={handleChange("foodName")}
              required
              placeholder="e.g. Chicken quinoa bowl"
              className="w-full rounded-xl border border-border bg-card-elevated px-4 py-3 text-sm text-white placeholder:text-subtle outline-none focus:border-border-focus"
            />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Quantity (g)">
              <input
                type="number"
                min="0"
                value={form.quantity}
                onChange={handleChange("quantity")}
                required
                className="w-full rounded-xl border border-border bg-card-elevated px-4 py-3 text-sm text-white outline-none focus:border-border-focus"
              />
            </FormField>
            <FormField label="Calories">
              <input
                type="number"
                min="0"
                value={form.calories}
                onChange={handleChange("calories")}
                required
                className="w-full rounded-xl border border-border bg-card-elevated px-4 py-3 text-sm text-white outline-none focus:border-border-focus"
              />
            </FormField>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <FormField label="Protein (g)">
              <input
                type="number"
                min="0"
                value={form.protein}
                onChange={handleChange("protein")}
                required
                className="w-full rounded-xl border border-border bg-card-elevated px-4 py-3 text-sm text-white outline-none focus:border-border-focus"
              />
            </FormField>
            <FormField label="Carbs (g)">
              <input
                type="number"
                min="0"
                value={form.carbs}
                onChange={handleChange("carbs")}
                required
                className="w-full rounded-xl border border-border bg-card-elevated px-4 py-3 text-sm text-white outline-none focus:border-border-focus"
              />
            </FormField>
            <FormField label="Fat (g)">
              <input
                type="number"
                min="0"
                value={form.fat}
                onChange={handleChange("fat")}
                required
                className="w-full rounded-xl border border-border bg-card-elevated px-4 py-3 text-sm text-white outline-none focus:border-border-focus"
              />
            </FormField>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-border px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-card-elevated"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {isSaving ? "Saving…" : meal ? "Save changes" : "Add meal"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const FormField = ({ label, children }) => (
  <div>
    <label className="mb-2 block text-sm font-medium text-muted">{label}</label>
    {children}
  </div>
);

export default MealFormModal;
