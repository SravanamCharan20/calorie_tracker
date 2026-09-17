import express from "express";
import userAuth from "../middlewares/auth.middleware.js";
import getNutrition from "../config/nutritionHelper.js";

const aiRouter = express.Router();

aiRouter.post(
  "/extract",
  userAuth,
  // Catch multer errors (wrong file type, file too large) before hitting Gemini.
  getNutrition
);

export default aiRouter;
