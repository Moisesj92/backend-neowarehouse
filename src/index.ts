import express from "express";
import type { Request, Response } from "express";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.json({
    mensaje: "¡Hola Mundo!",
    tecnologia: "Express + TypeScript + Node 22",
    status: "OK",
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
