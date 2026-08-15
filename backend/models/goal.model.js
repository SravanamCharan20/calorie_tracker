import mongoose from "mongoose";

const goalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
      unique: true,
    },
    dailyCalorieTarget: {
      type: Number,
      required: [true, "Daily calorie target is required"],
      default: 2200,
      min: [0, "Daily calorie target must be a non-negative number"],
    },
    proteinTarget: {
      type: Number,
      required: [true, "Protein target is required"],
      default: 150,
      min: [0, "Protein target must be a non-negative number"],
    },
    carbTarget: {
      type: Number,
      required: [true, "Carb target is required"],
      default: 250,
      min: [0, "Carb target must be a non-negative number"],
    },
    fatTarget: {
      type: Number,
      required: [true, "Fat target is required"],
      default: 70,
      min: [0, "Fat target must be a non-negative number"],
    },
    weightGoal: {
      type: Number,
      required: [true, "Weight goal is required"],
      default: 65,
      min: [0, "Weight goal must be a non-negative number"],
    },
  },
  { timestamps: true },
);

const Goal = mongoose.model("Goal", goalSchema);
export default Goal;
