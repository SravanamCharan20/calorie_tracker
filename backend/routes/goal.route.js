import express from "express";
import Goal from "../models/goal.model.js";
import userAuth from "../middlewares/auth.middleware.js";
import { handleRouteError } from "../utils/handleRouteError.js";

const goalRouter = express.Router();

goalRouter.get("/get", userAuth, async (req, res) => {
  try {
    let goalData = await Goal.findOne({
      userId: req.user._id,
    });

    if (!goalData) {
      // Safety net — older accounts or edge cases where signup goal creation was missed.
      goalData = await Goal.create({ userId: req.user._id });
    }

    return res.status(200).json({
      message: "Goal data fetched successfully",
      goal: goalData,
    });
  } catch (error) {
    return handleRouteError(
      res,
      error,
      "Something went wrong while getting goal data",
    );
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
    return handleRouteError(res, e, "Something went wrong while updating goal");
  }
});

export default goalRouter;
