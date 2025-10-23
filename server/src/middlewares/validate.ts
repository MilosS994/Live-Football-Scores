import { validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

interface ValidationError extends Error {
  status?: number;
  errors?: any[];
}

const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error: ValidationError = new Error("Validation failed");
    error.status = 400;
    error.errors = errors.array().map((err) => ({
      field: (err as any).path || (err as any).param,
      message: (err as any).msg,
    }));
    return next(error);
  }
  next();
};

export default validate;
