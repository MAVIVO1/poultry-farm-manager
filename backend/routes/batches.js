import express from "express";
import db from "../db.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = express.Router();
router.use(requireAuth);

router.get("/", (req, res) => {
  res.json(db.prepare("SELECT * FROM batches ORDER BY startDate DESC").all());
});

router.get("/:id", (req, res) => {
  const batch = db.prepare("SELECT * FROM batches WHERE id = ?").get(req.params.id);
  if (!batch) return res.status(404).json({ message: "Not found" });
  const health = db.prepare("SELECT * FROM health_logs WHERE batchId = ? ORDER BY logDate DESC").all(req.params.id);
  const feed = db.prepare("SELECT * FROM feed_logs WHERE batchId = ? ORDER BY logDate DESC").all(req.params.id);
  const eggs = db.prepare("SELECT * FROM egg_logs WHERE batchId = ? ORDER BY logDate DESC").all(req.params.id);
  res.json({ ...batch, health, feed, eggs });
});

router.post("/", requireRole("admin"), (req, res) => {
  const { batchName, breed, birdCount, startDate } = req.body;
  const info = db
    .prepare("INSERT INTO batches (batchName, breed, birdCount, startDate) VALUES (?, ?, ?, ?)")
    .run(batchName, breed || null, birdCount, startDate);
  res.status(201).json({ id: Number(info.lastInsertRowid) });
});

router.post("/:id/health", requireRole("admin"), (req, res) => {
  const { mortality, vaccination, notes } = req.body;
  db.prepare("INSERT INTO health_logs (batchId, mortality, vaccination, notes) VALUES (?, ?, ?, ?)").run(
    req.params.id,
    mortality || 0,
    vaccination || null,
    notes || null
  );
  res.status(201).json({ ok: true });
});

router.post("/:id/feed", requireRole("admin"), (req, res) => {
  const { feedType, quantityKg, costETB } = req.body;
  db.prepare("INSERT INTO feed_logs (batchId, feedType, quantityKg, costETB) VALUES (?, ?, ?, ?)").run(
    req.params.id,
    feedType || null,
    quantityKg || 0,
    costETB || 0
  );
  res.status(201).json({ ok: true });
});

router.post("/:id/eggs", requireRole("admin"), (req, res) => {
  const { eggsCollected, eggsBroken } = req.body;
  db.prepare("INSERT INTO egg_logs (batchId, eggsCollected, eggsBroken) VALUES (?, ?, ?)").run(
    req.params.id,
    eggsCollected || 0,
    eggsBroken || 0
  );
  res.status(201).json({ ok: true });
});

export default router;
