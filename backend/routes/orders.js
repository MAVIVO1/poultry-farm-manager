import express from "express";
import db from "../db.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = express.Router();
router.use(requireAuth);

// items: [{ productId, quantity }]
router.post("/checkout", (req, res) => {
  const { items } = req.body;
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "Cart is empty" });
  }

  let totalETB = 0;
  const resolvedItems = [];

  for (const item of items) {
    const product = db.prepare("SELECT * FROM products WHERE id = ?").get(item.productId);
    if (!product) return res.status(404).json({ message: `Product ${item.productId} not found` });
    if (product.stockQuantity < item.quantity) {
      return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
    }
    totalETB += product.priceETB * item.quantity;
    resolvedItems.push({ productId: product.id, quantity: item.quantity, unitPriceETB: product.priceETB });
  }

  const orderInfo = db
    .prepare("INSERT INTO orders (customerId, totalETB, paymentMethod) VALUES (?, ?, 'cash-on-delivery')")
    .run(req.user.id, totalETB);

  for (const item of resolvedItems) {
    db.prepare("INSERT INTO order_items (orderId, productId, quantity, unitPriceETB) VALUES (?, ?, ?, ?)").run(
      orderInfo.lastInsertRowid,
      item.productId,
      item.quantity,
      item.unitPriceETB
    );
    db.prepare("UPDATE products SET stockQuantity = stockQuantity - ? WHERE id = ?").run(
      item.quantity,
      item.productId
    );
  }

  res.status(201).json({ orderId: Number(orderInfo.lastInsertRowid), totalETB, paymentMethod: "cash-on-delivery" });
});

router.get("/mine", (req, res) => {
  res.json(db.prepare("SELECT * FROM orders WHERE customerId = ? ORDER BY createdAt DESC").all(req.user.id));
});

router.get("/", requireRole("admin"), (req, res) => {
  res.json(
    db
      .prepare(
        `SELECT o.*, u.name as customerName FROM orders o JOIN users u ON u.id = o.customerId ORDER BY o.createdAt DESC`
      )
      .all()
  );
});

router.patch("/:id/status", requireRole("admin"), (req, res) => {
  const { status } = req.body;
  db.prepare("UPDATE orders SET status = ? WHERE id = ?").run(status, req.params.id);
  res.json({ ok: true });
});

export default router;
