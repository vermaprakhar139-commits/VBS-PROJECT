import { Router } from "express";
import { requireAuth, requireAdmin } from "../middleware/auth";

const router = Router();

// GET /api/admin/summary
router.get("/summary", requireAuth, requireAdmin, (_req, res) => {
  res.json({ message: "Admin summary stub." });
});

export default router;