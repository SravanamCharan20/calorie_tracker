import express from "express";
import validator from "validator";
import User from "../models/user.model.js";
import userAuth from "../middlewares/auth.middleware.js";
import Goal from "../models/goal.model.js";
import { handleRouteError } from "../utils/handleRouteError.js";

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username?.trim() || !email?.trim() || !password) {
      return res.status(400).json({ message: "All fields are required !!" });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long",
      });
    }

    if (!validator.isEmail(email.trim())) {
      return res.status(400).json({
        message: "Please enter a valid email",
      });
    }

    const user = await User.findOne({ email: email.trim() });

    if (user) {
      return res
        .status(400)
        .json({ message: "Email is already registered !!" });
    }

    const newUser = await User.create({
      username: username.trim(),
      email: email.trim(),
      password,
    });

    await Goal.create({ userId: newUser._id });

    return res.status(201).json({
      message: "Signup successful !!",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    return handleRouteError(res, error, "Error While Signup !!");
  }
});

authRouter.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email?.trim() || !password) {
      return res.status(400).json({ message: "All fields are required !!" });
    }

    if (!validator.isEmail(email.trim())) {
      return res.status(400).json({ message: "Please enter a valid email" });
    }

    const user = await User.findOne({ email: email.trim() });
    const isPasswordMatched =
      user && (await user.checkPass(password));

    if (!isPasswordMatched) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = await user.createJWT();

    const isProd = process.env.NODE_ENV === "production";
    res.cookie("token", token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ message: "User login successfull !!" });
  } catch (error) {
    return handleRouteError(res, error, "Error While Signin !!");
  }
});

authRouter.post("/logout", (req, res) => {
  const isProd = process.env.NODE_ENV === "production";

  res.clearCookie("token", {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
  });

  return res.status(200).json({
    message: "Logout successful",
  });
});

authRouter.get("/me", userAuth, async (req, res) => {
  return res.status(200).json({
    user: req.user,
  });
});

export default authRouter;
