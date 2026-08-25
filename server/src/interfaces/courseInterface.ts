import { Document, Types } from "mongoose";
import { IUser } from "./userInterface";

export interface IComment extends Document {
  user: IUser;
  question: string;
  questionReplies?: IComment[];
}

export interface IReplyReview extends Document {
  user: IUser;
  comment: string;
}

export interface IReview extends Document {
  user: IUser;
  rating: number;
  comment: string;
  commentReplies?: IReplyReview[];
}

export interface ILink extends Document {
  title: string;
  url: string;
}

interface IThumbnail extends Document {
  public_Id: string;
  url: string;
}

export interface ICourseData extends Document {
  title: string;
  description: string;
  videoUrl: string;
  videoThumbnail: object;
  videoSection: string;
  videoLength: number;
  videoPlayer: string;
  links: ILink[];
  suggestion: string;
  questions: IComment[];
}

export interface ICourse extends Document {
  name: string;
  description: string;
  category: Types.ObjectId;
  price: number;
  estimatePrice: number;
  thumbnail: IThumbnail;
  tags: string;
  level: string;
  demoUrl: string;
  benefits: { title: string }[];
  prerequisites: { title: string }[];
  reviews: IReview[];
  courseData: ICourseData[];
  ratings?: number;
  purchased?: number;
}

//  ...........................................

export interface IAddQuestionData {
  question: string;
  courseId: string;
  contentId: string;
}

export interface IAnswerData {
  answer: string;
  questionId: string;
  contentId: string;
  courseId: string;
}

export interface IAddReviewData {
  rating: number;
  review: string;
}

export interface IAddReplyReviewData {
  comment: string;
  reviewId: string;
  courseId: string;
}
