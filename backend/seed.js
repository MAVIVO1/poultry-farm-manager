import bcrypt from "bcryptjs";
import db from "./db.js";

async function seed() {
  db.exec(
    "DELETE FROM order_items; DELETE FROM orders; DELETE FROM products; DELETE FROM egg_logs; DELETE FROM feed_logs; DELETE FROM health_logs; DELETE FROM batches; DELETE FROM users;"
  );

  const adminHash = await bcrypt.hash("admin123", 10);
  db.prepare("INSERT INTO users (name, email, passwordHash, role) VALUES (?, ?, ?, 'admin')").run(
    "Farm Admin",
    "admin@poultryfarm.local",
    adminHash
  );

  const customerHash = await bcrypt.hash("customer123", 10);
  db.prepare(
    "INSERT INTO users (name, email, passwordHash, role, phone, address) VALUES (?, ?, ?, 'customer', ?, ?)"
  ).run("Alemitu Wondwosen", "customer@poultryfarm.local", customerHash, "0922334455", "Debre Tabor");

  const batchInfo = db
    .prepare("INSERT INTO batches (batchName, breed, birdCount, startDate) VALUES (?, ?, ?, ?)")
    .run("Batch A - 2026", "Bovans Brown", 500, "2026-01-15");

  db.prepare("INSERT INTO health_logs (batchId, mortality, vaccination, notes) VALUES (?, ?, ?, ?)").run(
    batchInfo.lastInsertRowid,
    3,
    "Newcastle Disease",
    "Routine vaccination, no adverse reaction"
  );

  db.prepare("INSERT INTO feed_logs (batchId, feedType, quantityKg, costETB) VALUES (?, ?, ?, ?)").run(
    batchInfo.lastInsertRowid,
    "Layer mash",
    250,
    12500
  );

  db.prepare("INSERT INTO egg_logs (batchId, eggsCollected, eggsBroken) VALUES (?, ?, ?)").run(
    batchInfo.lastInsertRowid,
    420,
    8
  );

  db.prepare("INSERT INTO products (name, unit, priceETB, stockQuantity) VALUES (?, ?, ?, ?)").run(
    "Fresh Eggs (tray of 30)",
    "tray",
    350,
    40
  );
  db.prepare("INSERT INTO products (name, unit, priceETB, stockQuantity) VALUES (?, ?, ?, ?)").run(
    "Live Broiler Chicken",
    "bird",
    650,
    120
  );

  console.log("Seed complete.");
  console.log("Logins: admin@poultryfarm.local / admin123, customer@poultryfarm.local / customer123");
}

seed();
