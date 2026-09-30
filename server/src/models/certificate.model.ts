import { Schema, model, Types } from "mongoose";

const certificateSchema = new Schema(
  {
    certificateId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    user: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },

    course: {
      type: Types.ObjectId,
      ref: "Course",
      required: true,
    },

    organization: {
      type: Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },
    // Snapshot data
    studentName: {
      type: String,
      required: true,
      trim: true,
    },

    courseTitle: {
      type: String,
      required: true,
      trim: true,
    },

    learningHours: {
      type: Number,
      required: true,
      min: 0,
    },

    issuedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

certificateSchema.index({ user: 1, course: 1 }, { unique: true });

const CertificateModel = model("Certificate", certificateSchema);

export default CertificateModel;
