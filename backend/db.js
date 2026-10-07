import { DatabaseSync } from "node:sqlite";
import path from "path";

const db = new DatabaseSync(path.resolve("farm.db"));

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    passwordHash TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('admin','customer')),
    phone TEXT,
    address TEXT
  );

  CREATE TABLE IF NOT EXISTS batches (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    batchName TEXT NOT NULL,
    breed TEXT,
    birdCount INTEGER NOT NULL,
    startDate TEXT NOT NULL,
    status TEXT DEFAULT 'active' CHECK(status IN ('active','sold-out','closed'))
  );

  CREATE TABLE IF NOT EXISTS health_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    batchId INTEGER NOT NULL,
    logDate TEXT DEFAULT CURRENT_TIMESTAMP,
    mortality INTEGER DEFAULT 0,
    vaccination TEXT,
    notes TEXT,
    FOREIGN KEY(batchId) REFERENCES batches(id)
  );

  CREATE TABLE IF NOT EXISTS feed_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    batchId INTEGER NOT NULL,
    logDate TEXT DEFAULT CURRENT_TIMESTAMP,
    feedType TEXT,
    quantityKg REAL,
    costETB REAL,
    FOREIGN KEY(batchId) REFERENCES batches(id)
  );

  CREATE TABLE IF NOT EXISTS egg_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    batchId INTEGER NOT NULL,
    logDate TEXT DEFAULT CURRENT_TIMESTAMP,
    eggsCollected INTEGER DEFAULT 0,
    eggsBroken INTEGER DEFAULT 0,
    FOREIGN KEY(batchId) REFERENCES batches(id)
  );

  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    unit TEXT NOT NULL,
    priceETB REAL NOT NULL,
    stockQuantity REAL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customerId INTEGER NOT NULL,
    totalETB REAL NOT NULL,
    paymentMethod TEXT DEFAULT 'cash-on-delivery',
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending','delivered','cancelled')),
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(customerId) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    orderId INTEGER NOT NULL,
    productId INTEGER NOT NULL,
    quantity REAL NOT NULL,
    unitPriceETB REAL NOT NULL,
    FOREIGN KEY(orderId) REFERENCES orders(id),
    FOREIGN KEY(productId) REFERENCES products(id)
  );
`);

export default db;
