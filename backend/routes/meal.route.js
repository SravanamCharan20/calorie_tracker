import express from "express";
import Meal from "../models/meal.model.js";
import userAuth from "../middlewares/auth.middleware.js";
import pdfUpload from "../middlewares/pdfUpload.middleware.js";
import createMeal from "../config/tools/mealTool.js";
import {
  extractTextFromPdf,
  parseMealPdfText,
} from "../utils/parseMealPdf.js";

const mealRouter = express.Router();

mealRouter.post("/create", userAuth, async (req, res) => {
  try {
    const {
      mealType,
      foodName,
      quantity,
      calories,
      protein,
      carbs,
      fat,
      micronutrients,
      consumedAt,
    } = req.body;

    const meal = await createMeal({
      userId: req.user._id,
      mealType,
      foodName,
      quantity,
      calories,
      protein,
      carbs,
      fat,
      micronutrients,
      consumedAt,
    });

    return res.status(201).json({
      message: "Meal created successfully",
      meal,
    });
  } catch (e) {
    console.log("Error:", e);

    return res.status(500).json({
      message: "Something went wrong while meal creation !!",
    });
  }
});

mealRouter.post(
  "/import/pdf",
  userAuth,
  (req, res, next) => {
    pdfUpload.single("pdf")(req, res, (uploadError) => {
      if (uploadError) {
        return res.status(400).json({
          message: uploadError.message,
        });
      }

      next();
    });
  },
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          message: "PDF file is required",
        });
      }

      const text = await extractTextFromPdf(req.file.buffer);
      const { meals, skippedRows } = parseMealPdfText(text);

      const importedMeals = [];

      for (const mealData of meals) {
        const meal = await createMeal({
          userId: req.user._id,
          ...mealData,
        });

        importedMeals.push(meal);
      }

      return res.status(201).json({
        message: "PDF imported successfully",
        imported: importedMeals.length,
        skipped: skippedRows.length,
        skippedRows,
        meals: importedMeals,
      });
    } catch (error) {
      console.log("PDF import error:", error);

      if (error.message?.includes("Only PDF files are allowed")) {
        return res.status(400).json({ message: error.message });
      }

      if (error.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          message: "PDF must be 10MB or smaller",
        });
      }

      return res.status(400).json({
        message: error.message || "Something went wrong while importing the PDF",
      });
    }
  },
);

mealRouter.get("/get", userAuth, async (req, res) => {
  try {
    const {
      startDate,
      endDate,
      mealType,
      search,
      page = 1,
      limit = 10,
    } = req.query;

    const currentPage = Number(page);
    const pageLimit = Number(limit);

    if (
      !Number.isInteger(currentPage) ||
      !Number.isInteger(pageLimit) ||
      currentPage < 1 ||
      pageLimit < 1
    ) {
      return res.status(400).json({
        message: "Page and limit must be positive integers",
      });
    }

    const filter = {
      userId: req.user._id,
    };

    if (mealType) {
      filter.mealType = mealType;
    }

    if (search?.trim()) {
      filter.foodName = { $regex: search.trim(), $options: "i" };
    }

    if (startDate || endDate) {
      filter.consumedAt = {};

      if (startDate) {
        const parsedStartDate = new Date(startDate);

        if (Number.isNaN(parsedStartDate.getTime())) {
          return res.status(400).json({
            message: "Invalid startDate",
          });
        }
        filter.consumedAt.$gte = parsedStartDate;
      }

      if (endDate) {
        const parsedEndDate = new Date(endDate);

        if (Number.isNaN(parsedEndDate.getTime())) {
          return res.status(400).json({
            message: "Invalid endDate",
          });
        }
        filter.consumedAt.$lte = parsedEndDate;
      }
    }

    const pageSkip = pageLimit * (currentPage - 1);
    const total = await Meal.countDocuments(filter);
    const totalPages = total === 0 ? 1 : Math.ceil(total / pageLimit);

    const meals = await Meal.find(filter)
      .sort({ consumedAt: -1 })
      .skip(pageSkip)
      .limit(pageLimit);

    return res.status(200).json({
      message: "Meal data fetched successfully",
      meals,
      page: currentPage,
      limit: pageLimit,
      total,
      totalPages,
    });
  } catch (e) {
    console.log("Error:", e);

    return res.status(500).json({
      message: "Something went wrong while getting meal data",
    });
  }
});

mealRouter.get("/get/:id", userAuth, async (req, res) => {
  try {
    const meal = await Meal.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!meal) {
      return res.status(404).json({
        message: "Meal not found",
      });
    }

    return res.status(200).json({
      message: "Meal fetched successfully",
      meal,
    });
  } catch (e) {
    console.log("Error:", e);

    return res.status(500).json({
      message: "Something went wrong while getting meal",
    });
  }
});

mealRouter.patch("/update/:id", userAuth, async (req, res) => {
  try {
    const {
      mealType,
      foodName,
      quantity,
      calories,
      protein,
      carbs,
      fat,
      micronutrients,
      consumedAt,
    } = req.body;

    const updates = {};

    if (mealType !== undefined) updates.mealType = mealType;
    if (foodName !== undefined) updates.foodName = foodName;
    if (quantity !== undefined) updates.quantity = quantity;
    if (calories !== undefined) updates.calories = calories;
    if (protein !== undefined) updates.protein = protein;
    if (carbs !== undefined) updates.carbs = carbs;
    if (fat !== undefined) updates.fat = fat;
    if (micronutrients !== undefined) {
      updates.micronutrients = micronutrients;
    }
    if (consumedAt !== undefined) updates.consumedAt = consumedAt;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        message: "At least one meal field is required for update",
      });
    }

    const meal = await Meal.findOneAndUpdate(
      {
        _id: req.params.id,
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

    if (!meal) {
      return res.status(404).json({
        message: "Meal not found",
      });
    }

    return res.status(200).json({
      message: "Meal updated successfully",
      meal,
    });
  } catch (e) {
    console.log("Error:", e);

    return res.status(500).json({
      message: "Something went wrong while updating meal data",
    });
  }
});

mealRouter.delete("/delete/:id", userAuth, async (req, res) => {
  try {
    const meal = await Meal.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!meal) {
      return res.status(404).json({
        message: "Meal not found",
      });
    }

    return res.status(200).json({
      message: "Meal deleted successfully",
    });
  } catch (e) {
    console.log("Error:", e);

    return res.status(500).json({
      message: "Something went wrong while deleting meal data",
    });
  }
});

export default mealRouter;
