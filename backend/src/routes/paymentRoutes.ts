import { Router } from "express";
import {
  createStripeSession,
  createRazorpayOrderController,
  stripeWebhook,
  razorpayWebhook
} from "../controllers/paymentController";

const router = Router();

router.post("/stripe/session", createStripeSession);
router.post("/razorpay/order", createRazorpayOrderController);

// NOTE: raw body middleware is usually needed for webhooks;
// for now we'll assume JSON for simplicity.
router.post("/stripe/webhook", stripeWebhook);
router.post("/razorpay/webhook", razorpayWebhook);

export default router;