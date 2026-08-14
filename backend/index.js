import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
dotenv.config();
import authRouter from "./routes/auth.route.js";
import cookieParser from "cookie-parser";

const app = express();
const PORT = process.env.PORT || 6969;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use('/auth',authRouter);


app.listen(PORT, async () => {
  try {
    await connectDB();
    console.log(`Server is running on port ${PORT}`);
  } catch (e) {
    console.log("Error while server connection", e);
  }
});
