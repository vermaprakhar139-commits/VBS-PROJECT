import { Router, Response } from "express";
import { requireAuth, AuthRequest } from "../middleware/auth";
import { Booking } from "../models/Booking";
import * as bookingService from "../services/bookingService";

const router = Router();

// POST /api/bookings
router.post("/", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const {
      scheduleId,
      date,
      seats,
      fromCity,
      toCity,
      operatorName,
      passengers,
      contactInfo,
      totalPrice,
      couponCode,
      busNumber,
      driver,
    } = req.body;

    if (!scheduleId || !date || !seats || !Array.isArray(seats) || seats.length === 0) {
      return res.status(400).json({ error: "Missing required fields: scheduleId, date, seats" });
    }

    // totalPrice represents base fare (pre-tax)
    const baseSeatPrice = totalPrice / seats.length;
    const travelDate = new Date(date);
    const tax = Math.round(totalPrice * 0.18);
    const fees = 50;

    // Create booking
    const booking = await bookingService.createPendingBooking({
      userId: userId.toString(),
      scheduleId,
      seats,
      baseSeatPrice,
      travelDate,
    });

    // Update booking with additional info
    booking.operatorName = operatorName || "VBS Travels";
    booking.busNumber = busNumber || `VBS-${Date.now().toString().slice(-4)}`;
    booking.fromCity = fromCity || "From City";
    booking.toCity = toCity || "To City";
    booking.driver = driver || {
      name: "On-duty Captain",
      phone: "+91 90000 00000",
      experienceYears: 5,
      rating: 4.7,
    };
    
    // Recalculate prices based on actual total
    booking.subtotal = Math.round(totalPrice);
    booking.tax = tax;
    booking.fees = fees;
    booking.total = booking.subtotal + booking.tax + booking.fees;
    
    booking.status = "confirmed"; // Mark as confirmed since payment is done
    booking.paymentProvider = "wallet"; // Mock payment provider
    booking.paymentId = `PAY-${Date.now()}`;
    if (couponCode) {
      booking.couponCode = couponCode;
    }
    await booking.save();

    // Convert to plain object for JSON response
    const bookingObj = booking.toObject();
    res.status(201).json({ booking: bookingObj });
  } catch (error: any) {
    console.error("Error creating booking:", error);
    
    // Handle validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e: any) => e.message).join(", ");
      return res.status(400).json({ error: `Validation error: ${messages}` });
    }
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      return res.status(400).json({ error: "Booking already exists" });
    }
    
    // Handle cast errors (invalid ObjectId, etc.)
    if (error.name === "CastError") {
      return res.status(400).json({ error: `Invalid ${error.path}: ${error.value}` });
    }
    
    res.status(500).json({ error: error.message || "Failed to create booking" });
  }
});

// GET /api/bookings/me
router.get("/me", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const bookings = await Booking.find({ user: userId })
      .sort({ createdAt: -1 })
      .lean();

    res.json({ bookings });
  } catch (error: any) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

// GET /api/bookings/:id
router.get("/:id", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const bookingId = req.params.id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const booking = await Booking.findOne({ _id: bookingId, user: userId }).lean();

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    res.json({ booking });
  } catch (error: any) {
    console.error("Error fetching booking:", error);
    res.status(500).json({ error: "Failed to fetch booking" });
  }
});

export default router;