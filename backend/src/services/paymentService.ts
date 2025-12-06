import Stripe from "stripe";
import Razorpay from "razorpay";
import { env } from "../config/env";
import { Booking } from "../models/Booking";

const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20" as any
});

const razorpay = new Razorpay({
  key_id: env.RAZORPAY_KEY_ID,
  key_secret: env.RAZORPAY_KEY_SECRET
});

export async function createStripeCheckoutSession(bookingId: string, successUrl: string, cancelUrl: string) {
  const booking = await Booking.findById(bookingId);
  if (!booking) throw new Error("Booking not found");

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: booking.currency.toLowerCase(),
          unit_amount: booking.total * 100,
          product_data: {
            name: `Bus booking ${booking.fromCity} → ${booking.toCity}`,
            description: `${booking.seats.length} seat(s)`
          }
        }
      }
    ],
    success_url: successUrl + `?bookingId=${booking.id}&provider=stripe`,
    cancel_url: cancelUrl + `?bookingId=${booking.id}&provider=stripe`
  });

  return session;
}

export async function createRazorpayOrder(bookingId: string) {
  const booking = await Booking.findById(bookingId);
  if (!booking) throw new Error("Booking not found");

  const order = await razorpay.orders.create({
    amount: booking.total * 100,
    currency: booking.currency.toUpperCase(),
    receipt: booking.id,
    payment_capture: 1
  });

  return order;
}