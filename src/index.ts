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

// Get all products
app.get("/", async (req: Request, res: Response) => {
  const productCount = await prisma.product.count();
  res.json(
    productCount === 0
      ? "No product have been added yet."
      : "Some product have been added to the database."
  );
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
