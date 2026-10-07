import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import "./db.js";

import authRoutes from "./routes/auth.js";
import batchRoutes from "./routes/batches.js";
import productRoutes from "./routes/products.js";
import orderRoutes from "./routes/orders.js";
import analyticsRoutes from "./routes/analytics.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/auth", authRoutes);
app.use("/api/batches", batchRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/analytics", analyticsRoutes);

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`Poultry Farm Manager API running on port ${PORT}`));

export default app;
