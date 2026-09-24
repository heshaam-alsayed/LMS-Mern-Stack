import { NextFunction, Request, Response } from "express";
import { stripe } from "../config/stripe";
import { createOrder } from "../services/order.service";
import CourseModel from "../models/course.model";
import { getIO } from "../socketServer";

export const stripeWebhook = async (req: Request, res: Response) => {
  const signature = req.headers["stripe-signature"];

  if (!signature) {
    return res.status(400).json({
      success: false,
      message: "Missing Stripe signature",
    });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (error) {
    console.error("Stripe webhook signature verification failed:", error);

    return res.status(400).json({
      success: false,
      message: "Invalid Stripe webhook signature",
    });
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object;

        const { userId, courseId } = paymentIntent.metadata;

        if (!userId || !courseId) {
          console.error("Missing userId or courseId in PaymentIntent metadata");

          return res.status(400).json({
            success: false,
            message: "Missing payment metadata",
          });
        }

        const result = await createOrder(userId, courseId, paymentIntent);
        console.log(result);
        // Duplicate webhook or already purchased
        if (!result) {
          break;
        }


        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object;

        console.log("Payment failed:", paymentIntent.id);

        break;
      }

      case "payment_intent.canceled": {
        const paymentIntent = event.data.object;

        console.log("Payment canceled:", paymentIntent.id);

        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return res.status(200).json({
      received: true,
    });
  } catch (error) {
    console.error("Webhook processing error:", error);

    return res.status(500).json({
      success: false,
      message: "Webhook processing failed",
    });
  }
};

export const getStripePublishableKey = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    return res.status(200).json({
      success: true,
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    });
  } catch (error) {
    next(error);
  }
};

export const newPayment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { courseId } = req.body;

    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized ",
      });
    }

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required",
      });
    }

    // Get course from database
    const course = await CourseModel.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Check if user already purchased the course
    const alreadyPurchased = user.courses?.some(
      (id) => id.toString() === course._id.toString(),
    );

    if (alreadyPurchased) {
      return res.status(400).json({
        success: false,
        message: "You have already purchased this course",
      });
    }

    // Create PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(course.price * 100),
      currency: "usd",

      automatic_payment_methods: {
        enabled: true,
      },

      metadata: {
        userId: user._id.toString(),
        courseId: course._id.toString(),
      },
    });

    return res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    next(error);
  }
};
