import express from "express";
import Goal from "../models/goal.model.js";
import userAuth from "../middlewares/auth.middleware.js";

const goalRouter = express.Router();

goalRouter.get("/get", userAuth, async (req, res) => {
  try {
    const goalData = await Goal.findOne({
      userId: req.user._id,
    });

    if (!goalData) {
      return res.status(404).json({
        message: "Goal data not found",
      });
    }

    return res.status(200).json({
      message: "Goal data fetched successfully",
      goal: goalData,
    });
  } catch (error) {
    console.log("Error:", error);

    return res.status(500).json({
      message: "Something went wrong while getting goal data",
    });
  }
});

goalRouter.patch("/update", userAuth, async (req, res) => {
  try {
    const {
      dailyCalorieTarget,
      proteinTarget,
      carbTarget,
      fatTarget,
      weightGoal,
    } = req.body;

    const updates = {};

    if (dailyCalorieTarget !== undefined) {
      updates.dailyCalorieTarget = dailyCalorieTarget;
    }

    if (proteinTarget !== undefined) {
      updates.proteinTarget = proteinTarget;
    }

    if (carbTarget !== undefined) {
      updates.carbTarget = carbTarget;
    }

    if (fatTarget !== undefined) {
      updates.fatTarget = fatTarget;
    }

    if (weightGoal !== undefined) {
      updates.weightGoal = weightGoal;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        message: "At least one goal field is required for update",
      });
    }

    const goal = await Goal.findOneAndUpdate(
      {
        userId: req.user._id,
      },
      {
        $set: updates,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!goal) {
      return res.status(404).json({
        message: "Goal not found",
      });
    }

    return res.status(200).json({
      message: "Goal updated successfully",
      goal,
    });
  } catch (e) {
    console.log("Error:", e);

    return res.status(500).json({
      message: "Something went wrong while updating goal",
    });
  }
});

export default goalRouter;
