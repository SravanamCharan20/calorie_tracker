import mongoose from "mongoose";

const mealSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    mealType: {
      type: String,
      enum: {
        values: ["breakfast", "lunch", "dinner", "snacks"],
        message: "Meal type must be breakfast, lunch, dinner, or snacks",
      },
      required: [true, "Meal type is required"],
    },
    foodName: {
      type: String,
      required: [true, "Food name is required"],
      trim: true,
      minlength: [1, "Food name is required"],
      maxlength: [200, "Food name cannot exceed 200 characters"],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [0, "Quantity must be a non-negative number"],
    },
    calories: {
      type: Number,
      required: [true, "Calories is required"],
      min: [0, "Calories must be a non-negative number"],
    },
    protein: {
      type: Number,
      required: [true, "Protein is required"],
      min: [0, "Protein must be a non-negative number"],
    },
    carbs: {
      type: Number,
      required: [true, "Carbs is required"],
      min: [0, "Carbs must be a non-negative number"],
    },
    fat: {
      type: Number,
      required: [true, "Fat is required"],
      min: [0, "Fat must be a non-negative number"],
    },
    micronutrients: {
      iron: {
        type: Number,
        default: 0,
        min: [0, "Iron must be a non-negative number"],
      },
      calcium: {
        type: Number,
        default: 0,
        min: [0, "Calcium must be a non-negative number"],
      },
      vitaminC: {
        type: Number,
        default: 0,
        min: [0, "Vitamin C must be a non-negative number"],
      },
      vitaminD: {
        type: Number,
        default: 0,
        min: [0, "Vitamin D must be a non-negative number"],
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
