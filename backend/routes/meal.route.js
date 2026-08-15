import express from "express";
import Meal from "../models/meal.model.js";
import userAuth from "../middlewares/auth.middleware.js";
import pdfUpload from "../middlewares/pdfUpload.middleware.js";
import createMeal from "../config/tools/mealTool.js";
import {
  extractTextFromPdf,
  parseMealPdfText,
} from "../utils/parseMealPdf.js";
import { handleRouteError } from "../utils/handleRouteError.js";

const mealRouter = express.Router();

// Shared meal creation logic lives in mealTool.js so routes, chat, and PDF import all use the same rules.
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
    return handleRouteError(
      res,
      e,
      "Something went wrong while meal creation !!",
    );
  }
});

mealRouter.post(
  "/import/pdf",
  userAuth,
  // Wrap multer so upload errors (wrong file type, too large) return JSON instead of crashing.
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
      const importErrors = [...skippedRows];

      // Import row by row — one bad row should not cancel the whole upload.
      for (const mealData of meals) {
        try {
          const meal = await createMeal({
            userId: req.user._id,
            ...mealData,
          });

          importedMeals.push(meal);
        } catch (rowError) {
          importErrors.push({
            foodName: mealData.foodName ?? "Unknown meal",
            reason: rowError.message,
          });
        }
      }

      if (importedMeals.length === 0) {
        return res.status(400).json({
          message: "No meals could be imported from the PDF",
          skipped: importErrors.length,
          skippedRows: importErrors,
        });
      }

      return res.status(201).json({
        message: "PDF imported successfully",
        imported: importedMeals.length,
        skipped: importErrors.length,
        skippedRows: importErrors,
        meals: importedMeals,
      });
    } catch (error) {
      if (error.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          message: "PDF must be 10MB or smaller",
        });
      }

      if (
        typeof error.message === "string" &&
        (error.message.includes("No valid meal rows") ||
          error.message.includes("Only PDF files are allowed"))
      ) {
        return res.status(400).json({ message: error.message });
      }

      return handleRouteError(
        res,
        error,
        "Could not import the PDF. Check the format and try again.",
      );
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
      userId: req.user._id, // Each user only sees their own meals.
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

    // Newest meals first; skip/limit handles pagination on the server.
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
    return handleRouteError(
      res,
      e,
      "Something went wrong while getting meal data",
    );
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
    return handleRouteError(res, e, "Something went wrong while getting meal");
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
    return handleRouteError(
      res,
      e,
      "Something went wrong while updating meal data",
    );
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
    return handleRouteError(
      res,
      e,
      "Something went wrong while deleting meal data",
    );
  }
});

export default mealRouter;
