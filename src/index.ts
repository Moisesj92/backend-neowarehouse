import express from "express";
import { prisma } from "./lib/prisma";
import productRoutes from "./routes/product.routes";
import categoryRoutes from "./routes/category.routes";

const app = express();

app.use(express.json());

// Ruta de healthcheck
app.get("/api/status", (req, res) => {
  res.json({
    status: "Running",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);

const PORT = 3000;

const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

const shutdown = async (signal: string) => {
  console.log(`\n${signal} received. Closing gracefully...`);

  server.close(() => {
    console.log("HTTP server closed");
  });

  await prisma.$disconnect();
  console.log("Database connections closed");

  process.exit(0);
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
