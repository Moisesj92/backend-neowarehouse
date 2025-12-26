import type { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";

export const validate = <T extends z.ZodTypeAny>(schema: T) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const validated = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      if (
        validated &&
        typeof validated === "object" &&
        !Array.isArray(validated)
      ) {
        if ("body" in validated) {
          req.body = validated.body;
        }

        if ("query" in validated) {
          Object.assign(req.query, validated.query);
        }

        if ("params" in validated) {
          Object.assign(req.params, validated.params);
        }
      }

      next();
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        res.status(400).json({
          status: "error",
          message: "Errores de validación",
          errors: error.issues.map((issue) => ({
            field: issue.path.slice(1).join("."),
            message: issue.message,
          })),
        });
        return;
      }

      next(error);
    }
  };
};
