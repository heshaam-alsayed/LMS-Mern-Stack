import mongoose, { Schema } from "mongoose";
import { IInstructorApplication } from "../interfaces/instructorApplication";

const instructorApplicationSchema = new Schema<IInstructorApplication>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    organizationName: {
      type: String,
      required: [true, "Organization name is required"],
      trim: true,
    },

    organizationDescription: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true,
    },

    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    reviewedAt: {
      type: Date,
    },

    rejectionReason: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

const InstructorApplicationModel = mongoose.model<IInstructorApplication>(
  "InstructorApplication",
  instructorApplicationSchema,
);

export default InstructorApplicationModel;
