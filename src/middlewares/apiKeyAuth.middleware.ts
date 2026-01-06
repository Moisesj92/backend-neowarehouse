import type { Request, Response, NextFunction } from "express";

export const ApiKeyAuth = (req: Request, res: Response, next: NextFunction) => {
  if (req.method === "GET") {
    return next();
  }

  const apiKey = req.headers["x-api-key"];

  if (!apiKey) {
    return res.status(401).json({
      status: "error",
      message: "API Key required",
    });
  }

  if (apiKey !== process.env.API_SECRET_KEY) {
    return res.status(401).json({
      status: "error",
      message: "Invalid API Key",
    });
  }

  next();
};
