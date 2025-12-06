import { Schema, model, Document, Types } from "mongoose";

export type BookingStatus =
  | "pending"
  | "awaiting_payment"
  | "confirmed"
  | "cancelled"
  | "refunded";

export interface ISeatSelection {
  seatNumber: string;
  price: number;
  class: "regular" | "premium";
}

export interface IBooking extends Document {
  user: Types.ObjectId;
  schedule: Types.ObjectId;
  operatorName: string;
  busNumber?: string;
  fromCity: string;
  toCity: string;
  travelDate: Date;
  seats: ISeatSelection[];
  subtotal: number;
  tax: number;
  fees: number;
  total: number;
  currency: string;
  paymentProvider: "stripe" | "razorpay" | "wallet" | null;
  paymentId?: string;
  status: BookingStatus;
  couponCode?: string;
  driver?: {
    name: string;
    phone: string;
    experienceYears?: number;
    rating?: number;
  };
  refundAmount?: number;
}

const bookingSchema = new Schema<IBooking>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    schedule: { type: Schema.Types.ObjectId, ref: "Schedule", required: true },
    operatorName: { type: String, required: true },
    busNumber: { type: String },
    fromCity: { type: String, required: true },
    toCity: { type: String, required: true },
    travelDate: { type: Date, required: true },
    seats: [
      {
        seatNumber: String,
        price: Number,
        class: { type: String, enum: ["regular", "premium"] }
      }
    ],
    subtotal: Number,
    tax: Number,
    fees: Number,
    total: Number,
    currency: { type: String, default: "INR" },
    paymentProvider: { type: String, enum: ["stripe", "razorpay", "wallet", null], default: null },
    paymentId: String,
    status: {
      type: String,
      enum: ["pending", "awaiting_payment", "confirmed", "cancelled", "refunded"],
      default: "pending"
    },
    couponCode: String,
    driver: {
      name: String,
      phone: String,
      experienceYears: Number,
      rating: Number
    },
    refundAmount: Number
  },
  { timestamps: true }
);

export const Booking = model<IBooking>("Booking", bookingSchema);