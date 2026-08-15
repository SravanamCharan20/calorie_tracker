import express from "express";
import userAuth from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";
import {gemini} from "../config/geminiConfig.js";

const aiRouter = express.Router();

const nutritionSchema = {
  type: "object",
  properties: {
    foodName: {
      type: "string",
      description: "Name of the food or meal",
    },
    quantity: {
      type: "number",
      description: "Estimated quantity of food in grams",
    },
    calories: {
      type: "number",
      description: "Estimated calories in kcal",
    },
    protein: {
      type: "number",
      description: "Protein in grams",
    },
    carbs: {
      type: "number",
      description: "Carbohydrates in grams",
    },
    fat: {
      type: "number",
      description: "Fat in grams",
    },
    micronutrients: {
      type: "object",
      properties: {
        iron: {
          type: "number",
          description: "Iron in milligrams",
        },
        calcium: {
          type: "number",
          description: "Calcium in milligrams",
        },
        vitaminC: {
          type: "number",
          description: "Vitamin C in milligrams",
        },
        vitaminD: {
          type: "number",
          description: "Vitamin D in micrograms",
        },
      },
      required: ["iron", "calcium", "vitaminC", "vitaminD"],
    },
  },
  required: [
    "foodName",
    "quantity",
    "calories",
    "protein",
    "carbs",
    "fat",
    "micronutrients",
  ],
};

aiRouter.post(
  "/extract",
  userAuth,
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          message: "Image is required",
        });
      }

      const base64Image = req.file.buffer.toString("base64");

      const interaction = await gemini.interactions.create({
        model: "gemini-3.6-flash",

        input: [
          {
            type: "text",
            text: `
              Analyze this food image or nutrition label.

              Extract the nutrition information that can be determined
              from the image.

              If this is a food photo rather than a nutrition label,
              estimate the nutrition values based on the visible food
              and estimated portion.

              Return only the structured nutrition data requested by
              the response schema.
            `,
          },
          {
            type: "image",
            data: base64Image,
            mime_type: req.file.mimetype,
          },
        ],

        response_format: {
          type: "text",
          mime_type: "application/json",
          schema: nutritionSchema,
        },

        store: false,
      });

      const nutritionData = JSON.parse(interaction.output_text);

      return res.status(200).json({
        message: "Nutrition extracted successfully",
        nutrition: nutritionData,
      });
    } catch (error) {
      console.log("Gemini error:", error);

      return res.status(500).json({
        message: "Something went wrong while extracting nutrition",
      });
    }
  },
);

export default aiRouter;