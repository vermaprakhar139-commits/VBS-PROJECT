import { Request, Response, NextFunction } from "express";
import { createStripeCheckoutSession, createRazorpayOrder } from "../services/paymentService";
import { markBookingPaid, cancelBooking } from "../services/bookingService";
import Stripe from "stripe";
import crypto from "crypto";
import { env } from "../config/env";
import { Booking } from "../models/Booking";

export async function createStripeSession(req: Request, res: Response, next: NextFunction) {
  try {
    const { bookingId } = req.body;
    const successUrl = `${process.env.CLIENT_ORIGIN}/checkout/success`;
    const cancelUrl = `${process.env.CLIENT_ORIGIN}/checkout/failure`;
    const session = await createStripeCheckoutSession(bookingId, successUrl, cancelUrl);
    res.json({ id: session.id, url: session.url });
  } catch (err) {
    next(err);
  }
}

export async function createRazorpayOrderController(req: Request, res: Response, next: NextFunction) {
  try {
    const { bookingId } = req.body;
    const order = await createRazorpayOrder(bookingId);
    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: env.RAZORPAY_KEY_ID
    });
  } catch (err) {
    next(err);
  }
}

export async function stripeWebhook(req: Request, res: Response, next: NextFunction) {
  try {
    const sig = req.headers["stripe-signature"] as string;
    const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
      apiVersion: "2024-06-20" as any
    });

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, env.STRIPE_WEBHOOK_SECRET);
    } catch (err: any) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const bookingId = (session.success_url || "").match(/bookingId=([^&]+)/)?.[1];
      if (bookingId) {
        await markBookingPaid(bookingId, "stripe", session.id);
      }
    }

    res.json({ received: true });
  } catch (err) {
    next(err);
  }
}

export async function razorpayWebhook(req: Request, res: Response) {
  const signature = req.headers["x-razorpay-signature"] as string;
  const body = JSON.stringify(req.body);

  const expectedSignature = crypto
    .createHmac("sha256", env.RAZORPAY_WEBHOOK_SECRET)
    .update(body)
    .digest("hex");

  if (signature !== expectedSignature) {
    return res.status(400).json({ message: "Invalid signature" });
  }

  const event = req.body;

  if (event.event === "payment.captured") {
    const payment = event.payload.payment.entity;
    const bookingId = payment.notes?.bookingId || payment.order_id; // adapt as needed
    if (bookingId) {
      markBookingPaid(bookingId, "razorpay", payment.id).catch(() => undefined);
    }
  }

  if (event.event === "refund.processed") {
    // you can update booking status to refunded here
    const payment = event.payload.refund.entity;
    const booking = await Booking.findOne({ paymentId: payment.payment_id });
    if (booking) {
      booking.status = "refunded";
      booking.refundAmount = payment.amount / 100;
      await booking.save();
    }
  }

  res.json({ received: true });
}