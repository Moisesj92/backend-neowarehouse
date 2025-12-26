import express from "express";
import type { Request, Response } from "express";
import { PrismaClient } from "./generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const app = express();
const prisma = new PrismaClient({
  adapter,
});

app.use(express.json());

app.get("/status", (req, res) => {
  res.json({
    status: "Running",
    timestamp: new Date().toISOString(),
  });
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
