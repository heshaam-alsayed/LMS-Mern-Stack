import mongoose, { Model, Schema } from "mongoose";
import {
  IComment,
  ICourse,
  ICourseData,
  ILink,
  IReplyReview,
  IReview,
} from "../interfaces/courseInterface";

const commentSchema = new Schema<IComment>(
  {
    user: Object,
    question: String,
    questionReplies: [Object],
  },
  {
    timestamps: true,
  },
);

const linkSchema = new Schema<ILink>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    url: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

const replyReviewSchema = new Schema<IReplyReview>(
  {
    user: Object,

    comment: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const reviewSchema = new Schema<IReview>(
  {
    user: {
      type: Object,
      required: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    comment: {
      type: String,
      required: true,
      trim: true,
    },

    commentReplies: [replyReviewSchema],
  },
  {
    timestamps: true,
  },
);

const courseDataSchema = new Schema<ICourseData>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    videoUrl: {
      type: String,
      required: true,
    },

    // videoThumbnail: {
    //   public_Id: {
    //     type: String,
    //   },

    //   url: {
    //     type: String,
    //   },
    // },

    videoSection: {
      type: String,
      required: true,
    },

    videoLength: {
      type: Number,
    },

    videoPlayer: {
      type: String,
    },

    links: [linkSchema],

    suggestion: {
      type: String,
    },

    questions: [commentSchema],
  },
  {
    timestamps: true,
  },
);

const courseSchema = new Schema<ICourse>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },

    estimatePrice: {
      type: Number,
      required: true,
    },

    thumbnail: {
      public_Id: {
        type: String,
      },

      url: {
        type: String,
      },
    },

    tags: String,

    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      required: true,
    },

    demoUrl: {
      type: String,
      required: true,
    },

    benefits: [
      {
        title: String,
      },
    ],

    prerequisites: [{ title: String }],

    reviews: [reviewSchema],

    courseData: [courseDataSchema],

    ratings: {
      type: Number,
      default: 0,
    },

    purchased: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

const CourseModel: Model<ICourse> = mongoose.model("Course", courseSchema);

export default CourseModel;
