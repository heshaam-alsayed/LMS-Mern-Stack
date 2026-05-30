import mongoose, { Model } from "mongoose";
import { IUser } from "../interfaces/userInterface";
import bcrypt from "bcryptjs";
import jwt, { Secret } from "jsonwebtoken";
import { StringValue } from "ms";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;

const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [3, "Name must be at least 3 characters"],
      maxlength: [20, "Name must not exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      unique: [true, "Email already exists"],
      trim: true,
      match: [emailRegex, "Please enter a valid email address"],
    },
    password: {
      type: String,
      minlength: [6, "Password must be at least 6 characters"],
      match: [
        passwordRegex,
        "Password must contain uppercase, lowercase and number",
      ],
      select: false,
    },
    role: {
      type: String,
      enum: {
        values: ["user", "instructor", "admin"],
        message: "Role must be user, instructor, or admin",
      },
      default: "user",
    },
    avatar: {
      public_Id: String,
      url: String,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
    
    isVerified: {
      type: Boolean,
      default: false,
    },

    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
  },
  {
    timestamps: true,
  },
);

// hash password before saving
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);
});

// compare entered password with hashed password in database
userSchema.methods.comparePassword = async function (
  enteredPassword: string,
): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

// ✅ ACCESS TOKEN
userSchema.methods.SignAccessToken = function () {
  return jwt.sign(
    { id: this._id.toString() },
    process.env.ACCESS_TOKEN_SECRET as Secret,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRE as StringValue,
    },
  );
};

// ✅ REFRESH TOKEN
userSchema.methods.SignRefreshToken = function () {
  return jwt.sign(
    { id: this._id.toString() },
    process.env.REFRESH_TOKEN_SECRET as Secret,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRE as StringValue,
    },
  );
};

const UserModel: Model<IUser> = mongoose.model("User", userSchema);
export default UserModel;
