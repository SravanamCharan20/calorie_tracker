import express from "express";
import User from "../models/user.model.js";

const authRouter = express.Router();
authRouter.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required !!" });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ message: "Email is already registered !!" });
    }

    const newUser = await User.create({ username, email, password });
    return res.status(201).json({
      message: "Signup successful !!",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.log("Error : ", error);
    return res.status(500).json({ message: "Error While Signup !!" });
  }
});

authRouter.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required !!" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found !!" });
    }

    const isPasswordMatched = await user.checkPass(password);
    if (!isPasswordMatched) {
      return res.status(400).json({ message: "Wrong Credentails !!" });
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
    console.log("Error : ", error);
    return res.status(500).json({ message: "Error While Signin !!" });
  }
});

export default authRouter;
