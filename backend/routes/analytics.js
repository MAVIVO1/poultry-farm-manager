import express from "express";
import db from "../db.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = express.Router();
router.use(requireAuth, requireRole("admin"));

router.get("/sales", (req, res) => {
  const totalSalesETB = db.prepare("SELECT COALESCE(SUM(totalETB),0) as total FROM orders").get().total;
  const orderCount = db.prepare("SELECT COUNT(*) as count FROM orders").get().count;
  const byProduct = db
    .prepare(
      `SELECT p.name, SUM(oi.quantity) as unitsSold, SUM(oi.quantity * oi.unitPriceETB) as revenueETB
       FROM order_items oi JOIN products p ON p.id = oi.productId
       GROUP BY p.id ORDER BY revenueETB DESC`
    )
    .all();
  res.json({ totalSalesETB, orderCount, byProduct });
});

router.get("/flock", (req, res) => {
  const batches = db.prepare("SELECT * FROM batches").all();
  const totalBirds = batches.reduce((sum, b) => sum + b.birdCount, 0);
  const totalMortality = db.prepare("SELECT COALESCE(SUM(mortality),0) as total FROM health_logs").get().total;
  const totalEggs = db.prepare("SELECT COALESCE(SUM(eggsCollected),0) as total FROM egg_logs").get().total;
  res.json({ activeBatches: batches.length, totalBirds, totalMortality, totalEggs });
});

export default router;
