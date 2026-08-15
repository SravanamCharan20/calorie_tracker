import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
      minlength: [1, "Username is required"],
      maxlength: [50, "Username cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: validator.isEmail,
        message: "Please enter a valid email",
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      validate: {
        validator(value) {
          if (!this.isModified("password")) {
            return true;
          }

          return typeof value === "string" && value.length >= 6;
        },
        message: "Password must be at least 6 characters long",
      },
    },
  },
  { timestamps: true },
);

// Hash password before saving — never store plain text passwords.
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.checkPass = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.createJWT = async function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  return token;
};

const User = mongoose.model("User", userSchema);
export default User;
