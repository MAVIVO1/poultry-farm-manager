import express from "express";
import db from "../db.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.json(db.prepare("SELECT * FROM products").all());
});

router.use(requireAuth);

router.post("/", requireRole("admin"), (req, res) => {
  const { name, unit, priceETB, stockQuantity } = req.body;
  const info = db
    .prepare("INSERT INTO products (name, unit, priceETB, stockQuantity) VALUES (?, ?, ?, ?)")
    .run(name, unit, priceETB, stockQuantity || 0);
  res.status(201).json({ id: Number(info.lastInsertRowid) });
});

router.put("/:id", requireRole("admin"), (req, res) => {
  const { name, unit, priceETB, stockQuantity } = req.body;
  db.prepare("UPDATE products SET name=?, unit=?, priceETB=?, stockQuantity=? WHERE id=?").run(
    name,
    unit,
    priceETB,
    stockQuantity,
    req.params.id
  );
  res.json({ ok: true });
});

export default router;
