import { useEffect, useRef, useState } from "react";
import { extractNutrition } from "../../services/aiService.js";

const mealTypes = [
  { label: "Breakfast", value: "breakfast" },
  { label: "Lunch", value: "lunch" },
  { label: "Dinner", value: "dinner" },
  { label: "Snack", value: "snacks" },
];

const micronutrientFields = [
  { key: "iron", label: "Iron", unit: "mg" },
  { key: "calcium", label: "Calcium", unit: "mg" },
  { key: "vitaminC", label: "Vitamin C", unit: "mg" },
  { key: "vitaminD", label: "Vitamin D", unit: "IU" },
];

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const emptyForm = {
  mealType: "breakfast",
  foodName: "",
  quantity: "",
  calories: "",
  protein: "",
  carbs: "",
  fat: "",
  iron: "",
  calcium: "",
  vitaminC: "",
  vitaminD: "",
};

const getInitialForm = (meal) => {
  if (!meal) return emptyForm;

  const micro = meal.micronutrients ?? {};

  return {
    mealType: meal.mealType,
    foodName: meal.foodName,
    quantity: String(meal.quantity),
    calories: String(meal.calories),
    protein: String(meal.protein),
    carbs: String(meal.carbs),
    fat: String(meal.fat),
    iron: micro.iron != null ? String(micro.iron) : "",
    calcium: micro.calcium != null ? String(micro.calcium) : "",
    vitaminC: micro.vitaminC != null ? String(micro.vitaminC) : "",
    vitaminD: micro.vitaminD != null ? String(micro.vitaminD) : "",
  };
};

const validateImageFile = (file) => {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return "Only JPEG, PNG, and WebP images are allowed.";
  }

  if (file.size > MAX_IMAGE_SIZE) {
    return "Image must be 5MB or smaller.";
  }

  return null;
};

const validateMealForm = (form) => {
  if (!form.foodName.trim()) {
    return "Food name is required.";
  }

  const numericFields = [
    { key: "quantity", label: "Quantity" },
    { key: "calories", label: "Calories" },
    { key: "protein", label: "Protein" },
    { key: "carbs", label: "Carbs" },
    { key: "fat", label: "Fat" },
  ];

  for (const { key, label } of numericFields) {
    const value = Number(form[key]);

    if (form[key] === "" || !Number.isFinite(value) || value < 0) {
      return `${label} must be a valid non-negative number.`;
    }
  }

  return null;
};

const MealFormModal = ({ meal, onClose, onSave, isSaving, saveError }) => {
  const [form, setForm] = useState(() => getInitialForm(meal));
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractError, setExtractError] = useState("");
  const [formError, setFormError] = useState("");
  const fileInputRef = useRef(null);
  const isEditing = Boolean(meal);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setFormError("");
  };

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    setExtractError("");

    if (!file) {
      return;
    }

    const validationError = validateImageFile(file);

    if (validationError) {
      setExtractError(validationError);
      e.target.value = "";
      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedImage(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleClearImage = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedImage(null);
    setPreviewUrl(null);
    setExtractError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleExtractNutrition = async () => {
    if (!selectedImage) {
      setExtractError("Select an image before scanning.");
      return;
    }

    try {
      setIsExtracting(true);
      setExtractError("");

      const response = await extractNutrition(selectedImage);
      const nutrition = response.nutrition;
      const micro = nutrition.micronutrients ?? {};

      setForm((prev) => ({
        ...prev,
        foodName: nutrition.foodName ?? prev.foodName,
        quantity:
          nutrition.quantity != null
            ? String(nutrition.quantity)
            : prev.quantity,
        calories:
          nutrition.calories != null
            ? String(nutrition.calories)
            : prev.calories,
        protein:
          nutrition.protein != null ? String(nutrition.protein) : prev.protein,
        carbs: nutrition.carbs != null ? String(nutrition.carbs) : prev.carbs,
        fat: nutrition.fat != null ? String(nutrition.fat) : prev.fat,
        iron: micro.iron != null ? String(micro.iron) : prev.iron,
        calcium: micro.calcium != null ? String(micro.calcium) : prev.calcium,
        vitaminC:
          micro.vitaminC != null ? String(micro.vitaminC) : prev.vitaminC,
        vitaminD:
          micro.vitaminD != null ? String(micro.vitaminD) : prev.vitaminD,
      }));
    } catch (error) {
      console.log("Extract nutrition error:", error);
      setExtractError(error.message);
    } finally {
      setIsExtracting(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError("");

    const validationError = validateMealForm(form);

    if (validationError) {
      setFormError(validationError);
      return;
    }

    onSave({
      mealType: form.mealType,
      foodName: form.foodName,
      quantity: Number(form.quantity),
      calories: Number(form.calories),
      protein: Number(form.protein),
      carbs: Number(form.carbs),
      fat: Number(form.fat),
      micronutrients: {
        iron: Number(form.iron) || 0,
        calcium: Number(form.calcium) || 0,
        vitaminC: Number(form.vitaminC) || 0,
        vitaminD: Number(form.vitaminD) || 0,
      },
    });
  };

  const isBusy = isSaving || isExtracting;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="meal-form-title"
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-border bg-card p-6 sm:p-7"
      >
        <h2 id="meal-form-title" className="text-lg font-semibold text-white">
          {isEditing ? "Edit meal" : "Add meal"}
        </h2>
        <p className="mt-1 text-sm text-muted">
          {isEditing
            ? "Update the meal details below."
            : "Log a new meal manually or scan a food photo with AI."}
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {!isEditing && (
            <section className="rounded-xl border border-border bg-card-elevated p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-white">
                    Scan food image
                  </p>
                  <p className="mt-0.5 text-xs text-muted">
                    JPEG, PNG, or WebP up to 5MB
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isBusy}
                  className="rounded-full border border-border px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-card disabled:opacity-50"
                >
                  Choose image
                </button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageSelect}
                disabled={isBusy}
                className="hidden"
              />

              {previewUrl && (
                <div className="mt-4 space-y-3">
                  <div className="overflow-hidden rounded-xl border border-border">
                    <img
                      src={previewUrl}
                      alt="Selected food preview"
                      className="max-h-48 w-full object-cover"
                    />
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={handleExtractNutrition}
                      disabled={isBusy}
                      className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-black transition-opacity hover:opacity-90 disabled:opacity-50"
                    >
                      {isExtracting ? "Scanning…" : "Extract nutrition"}
                    </button>
                    <button
                      type="button"
                      onClick={handleClearImage}
                      disabled={isBusy}
                      className="rounded-full border border-border px-4 py-2 text-xs font-medium text-muted transition-colors hover:text-white disabled:opacity-50"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}

              {extractError && (
                <p role="alert" className="mt-3 text-xs text-error">
                  {extractError}
                </p>
              )}
            </section>
          )}

          <FormField label="Meal type">
            <select
              value={form.mealType}
              onChange={handleChange("mealType")}
              required
              disabled={isBusy}
              className="w-full rounded-xl border border-border bg-card-elevated px-4 py-3 text-sm text-white outline-none focus:border-border-focus disabled:opacity-50"
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
              disabled={isBusy}
              placeholder="e.g. Chicken quinoa bowl"
              className="w-full rounded-xl border border-border bg-card-elevated px-4 py-3 text-sm text-white placeholder:text-subtle outline-none focus:border-border-focus disabled:opacity-50"
            />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Quantity (g)">
              <input
                type="number"
                min="0"
                step="any"
                value={form.quantity}
                onChange={handleChange("quantity")}
                required
                disabled={isBusy}
                className="w-full rounded-xl border border-border bg-card-elevated px-4 py-3 text-sm text-white outline-none focus:border-border-focus disabled:opacity-50"
              />
            </FormField>
            <FormField label="Calories">
              <input
                type="number"
                min="0"
                step="any"
                value={form.calories}
                onChange={handleChange("calories")}
                required
                disabled={isBusy}
                className="w-full rounded-xl border border-border bg-card-elevated px-4 py-3 text-sm text-white outline-none focus:border-border-focus disabled:opacity-50"
              />
            </FormField>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <FormField label="Protein (g)">
              <input
                type="number"
                min="0"
                step="any"
                value={form.protein}
                onChange={handleChange("protein")}
                required
                disabled={isBusy}
                className="w-full rounded-xl border border-border bg-card-elevated px-4 py-3 text-sm text-white outline-none focus:border-border-focus disabled:opacity-50"
              />
            </FormField>
            <FormField label="Carbs (g)">
              <input
                type="number"
                min="0"
                step="any"
                value={form.carbs}
                onChange={handleChange("carbs")}
                required
                disabled={isBusy}
                className="w-full rounded-xl border border-border bg-card-elevated px-4 py-3 text-sm text-white outline-none focus:border-border-focus disabled:opacity-50"
              />
            </FormField>
            <FormField label="Fat (g)">
              <input
                type="number"
                min="0"
                step="any"
                value={form.fat}
                onChange={handleChange("fat")}
                required
                disabled={isBusy}
                className="w-full rounded-xl border border-border bg-card-elevated px-4 py-3 text-sm text-white outline-none focus:border-border-focus disabled:opacity-50"
              />
            </FormField>
          </div>

          <section className="rounded-xl border border-border bg-card-elevated p-4">
            <p className="text-sm font-medium text-white">Micronutrients</p>
            <p className="mt-0.5 text-xs text-muted">
              Optional vitamins and minerals for this meal
            </p>

            <div className="mt-4 grid grid-cols-2 gap-4">
              {micronutrientFields.map(({ key, label, unit }) => (
                <FormField key={key} label={`${label} (${unit})`}>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={form[key]}
                    onChange={handleChange(key)}
                    disabled={isBusy}
                    placeholder="0"
                    className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-white placeholder:text-subtle outline-none focus:border-border-focus disabled:opacity-50"
                  />
                </FormField>
              ))}
            </div>
          </section>

          {(formError || saveError) && (
            <p
              role="alert"
              className="rounded-2xl border border-error/30 bg-error/10 px-4 py-3 text-sm text-error"
            >
              {formError || saveError}
            </p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isBusy}
              className="rounded-full border border-border px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-card-elevated disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isBusy}
              className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {isSaving ? "Saving…" : isEditing ? "Save changes" : "Add meal"}
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
