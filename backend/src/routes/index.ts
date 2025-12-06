import { Router } from "express";
import authRoutes from "./authRoutes";
import busRoutes from "./busRoutes";
import bookingRoutes from "./bookingRoutes";
import paymentRoutes from "./paymentRoutes";
import adminRoutes from "./adminRoutes";
import miscRoutes from "./miscRoutes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/buses", busRoutes);
router.use("/bookings", bookingRoutes);
router.use("/payments", paymentRoutes);
router.use("/admin", adminRoutes);
router.use("/misc", miscRoutes);

// Swagger docs temporarily disabled (no openapi.json file yet)

export default router;