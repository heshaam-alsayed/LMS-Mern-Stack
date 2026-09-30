import mongoose, { Model, Schema, Types } from "mongoose";

export interface ICourseProgress {
  user: Types.ObjectId;
  course: Types.ObjectId;
  organization: Types.ObjectId;
  currentLecture?: Types.ObjectId | null;
  completedLectures: Types.ObjectId[];
  lastAccessedAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

const courseProgressSchema = new Schema<ICourseProgress>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    organization: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },
    currentLecture: {
      type: Schema.Types.ObjectId,
      default: null,
    },

    completedLectures: [
      {
        type: Schema.Types.ObjectId,
      },
    ],

    lastAccessedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

courseProgressSchema.index(
  {
    user: 1,
    course: 1,
  },
  {
    unique: true,
  },
);

const CourseProgressModel: Model<ICourseProgress> = mongoose.model(
  "CourseProgress",
  courseProgressSchema,
);

export default CourseProgressModel;
