// daily calorie target,protein/carb/fat targets, weight goal
import mongoose from "mongoose";

const goalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    dailyCalorieTarget: {
      type: Number,
      required: true,
      default: 2200,
      min: 0,
    },
    proteinTarget: {
      type: Number,
      required: true,
      default: 150,
      min: 0,
    },
    carbTarget: {
      type: Number,
      required: true,
      default: 250,
      min: 0,
    },
    fatTarget: {
      type: Number,
      required: true,
      default: 70,
      min: 0,
    },
    weightGoal: {
      type: Number,
      required: true,
      default: 65,
      min: 0,
    },
  },
  { timestamps: true },
);

const Goal = mongoose.model("Goal", goalSchema);
export default Goal;
