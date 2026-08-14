import mongoose from "mongoose";

const mealSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    mealType: {
      type: String,
      enum: ["breakfast", "lunch", "dinner", "snacks"],
      required: true,
    },
    foodName: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    calories: {
      type: Number,
      required: true,
      min: 0,
    },
    protein: {
      type: Number,
      required: true,
      min: 0,
    },
    carbs: {
      type: Number,
      required: true,
      min: 0,
    },
    fat: {
      type: Number,
      required: true,
      min: 0,
    },
    micronutrients: {
      iron: {
        type: Number,
        default: 0,
      },
      calcium: {
        type: Number,
        default: 0,
      },
      vitaminC: {
        type: Number,
        default: 0,
      },
      vitaminD: {
        type: Number,
        default: 0,
      },
    },
    consumedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

const Meal = mongoose.model("Meal", mealSchema);
export default Meal;
