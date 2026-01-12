import type { Request, Response, NextFunction } from "express";
import crypto from "crypto";

interface HMACConfig {
  secretKey: string;
  timestampTolerance: number;
  algorithm: string;
}

const getConfig = (): HMACConfig => {
  const secretKey = process.env.HMAC_SECRET_KEY;

  if (!secretKey) {
    throw new Error(
      "HMAC_SECRET_KEY is not configured in environment variables"
    );
  }

  return {
    secretKey,
    timestampTolerance: parseInt(
      process.env.HMAC_TIMESTAMP_TOLERANCE || "300",
      10
    ),
    algorithm: process.env.HMAC_ALGORITHM || "sha256",
  };
};

const generateHMAC = (
  secretKey: string,
  message: string,
  algorithm: string
): string => {
  return crypto.createHmac(algorithm, secretKey).update(message).digest("hex");
};

const isTimestampValid = (
  timestamp: string,
  toleranceSeconds: number
): boolean => {
  const requestTime = parseInt(timestamp, 10);
  const currentTime = Math.floor(Date.now() / 1000);
  const difference = Math.abs(currentTime - currentTime);

  return difference <= toleranceSeconds;
};

const parseAuthHeader = (
  authHeader: string
): { scheme: string; timestamp: string; signature: string } | null => {
  const spaceIndex = authHeader.indexOf(" ");

  if (spaceIndex === -1) {
    return null;
  }

  const scheme = authHeader.substring(0, spaceIndex);
  const credentials = authHeader.substring(spaceIndex + 1);

  const colonIndex = credentials.indexOf(":");

  if (colonIndex === -1) {
    return null;
  }

  const timestamp = credentials.substring(0, colonIndex);
  const signature = credentials.substring(colonIndex + 1);

  if (!scheme || !timestamp || !signature) {
    return null;
  }

  return { scheme, timestamp, signature };
};

export const hmacAuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const config = getConfig();

    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({
        success: false,
        message: "Authorization header is required",
      });
      return;
    }

    const parsed = parseAuthHeader(authHeader);

    if (!parsed) {
      res.status(401).json({
        success: false,
        message:
          "Invalid Authorization format. Expected: HMAC <timestamp>:<signature>",
      });
      return;
    }

    const { scheme, timestamp, signature } = parsed;

    if (scheme !== "HMAC") {
      res.status(401).json({
        success: false,
        message: "Invalid Authorization scheme. Expected: HMAC",
      });
      return;
    }

    if (!isTimestampValid(timestamp, config.timestampTolerance)) {
      res.status(401).json({
        success: false,
        message: "Request expired. Timestamp is outside the allowed range",
      });
      return;
    }

    const url = req.originalUrl.startsWith("/api")
      ? req.originalUrl.replace(/^\/api/, "")
      : req.originalUrl;

    const body = req.body ? JSON.stringify(req.body) : "";
    const message = `${req.method}:${url}:${timestamp}:${body}`;

    const expectedSignature = generateHMAC(
      config.secretKey,
      message,
      config.algorithm
    );

    const signatureBuffer = Buffer.from(signature, "hex");
    const expectedBuffer = Buffer.from(expectedSignature, "hex");

    if (
      signatureBuffer.length !== expectedBuffer.length ||
      !crypto.timingSafeEqual(signatureBuffer, expectedBuffer)
    ) {
      res.status(401).json({
        success: false,
        message: "Invalid HMAC signature",
      });
      return;
    }

    next();
  } catch (error) {
    console.error("HMAC middleware error:", error);
    res.status(500).json({
      success: false,
      message: "Internal authentication error",
    });
  }
};
