import { Booking, IBooking } from "../models/Booking";
import { Types } from "mongoose";

/**
 * TEMP: simplified version that does NOT depend on Schedule model.
 * It just creates a dummy booking with fixed prices.
 */
interface CreateBookingInput {
  userId: string;
  scheduleId: string; // kept for future use
  seats: string[];
  baseSeatPrice: number;
  travelDate: Date;
}

export async function createPendingBooking(input: CreateBookingInput): Promise<IBooking> {
  const seatPrice = input.baseSeatPrice || 1000;

  const seats = input.seats.map((seat) => ({
    seatNumber: seat,
    price: seatPrice,
    class: "regular" as const
  }));

  const subtotal = seats.reduce((sum, s) => sum + s.price, 0);
  const tax = Math.round(subtotal * 0.18);
  const fees = 50;
  const total = subtotal + tax + fees;

  // Create a valid ObjectId for schedule (or use provided if valid)
  let scheduleObjectId: Types.ObjectId;
  try {
    // Try to use the provided scheduleId if it's a valid ObjectId
    if (Types.ObjectId.isValid(input.scheduleId)) {
      scheduleObjectId = new Types.ObjectId(input.scheduleId);
    } else {
      // Generate a new ObjectId if the provided one is invalid
      scheduleObjectId = new Types.ObjectId();
    }
  } catch {
    // Fallback to new ObjectId if anything fails
    scheduleObjectId = new Types.ObjectId();
  }

  const booking = await Booking.create({
    user: input.userId,
    schedule: scheduleObjectId,
    operatorName: "VBS Travels",
    fromCity: "From City",
    toCity: "To City",
    travelDate: input.travelDate,
    seats,
    subtotal,
    tax,
    fees,
    total,
    currency: "INR",
    status: "awaiting_payment"
  });

  return booking;
}

export async function markBookingPaid(
  bookingId: string,
  provider: "stripe" | "razorpay" | "wallet",
  paymentId: string
) {
  const booking = await Booking.findById(bookingId);
  if (!booking) throw new Error("Booking not found");

  booking.status = "confirmed";
  booking.paymentProvider = provider;
  booking.paymentId = paymentId;
  await booking.save();

  return booking;
}

export async function cancelBooking(bookingId: string) {
  const booking = await Booking.findById(bookingId);
  if (!booking) throw new Error("Booking not found");

  if (booking.status !== "confirmed") {
    throw new Error("Only confirmed bookings can be cancelled");
  }

  booking.status = "cancelled";
  booking.refundAmount = Math.round(booking.total * 0.8); // 80% refund simulation
  await booking.save();

  return booking;
}