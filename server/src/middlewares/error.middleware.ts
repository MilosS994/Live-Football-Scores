// src/middleware/errorMiddleware.ts
import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import "dotenv/config";

interface CustomError extends Error {
  status?: number;
  message: string;
  code?: number;
  keyValue?: any;
  errors?: any[];
}

export const errorMiddleware = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let status = err.status || 500;
  let message = err.message || "Something went wrong";
  let errors: any[] | undefined = undefined;

  if (err.errors && Array.isArray(err.errors)) {
    errors = err.errors;
  }

  // Mongoose Validation Error
  if (
    err.name === "ValidationError" &&
    err instanceof mongoose.Error.ValidationError
  ) {
    status = 400;
    message = "Validation failed";
    errors = Object.values(err.errors).map((error: any) => ({
      field: error.path,
      message: error.message,
      value: error.value,
    }));
  }

  // Mongoose Cast Error (invalid ObjectId)
  if (err.name === "CastError" && err instanceof mongoose.Error.CastError) {
    status = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // MongoDB Duplicate Key Error
  if (err.code === 11000 && err.keyValue) {
    status = 409;
    const field = Object.keys(err.keyValue)[0];
    message = `Duplicate value for field: ${field}`;
    errors = [{ field, message: `${field} already exists` }];
  }

  // Production message masking
  if (process.env.NODE_ENV === "production" && status === 500) {
    message = "Internal Server Error";
  }

  // Development logging
  if (process.env.NODE_ENV !== "production") {
    console.error(
      `\n[${new Date().toISOString()}] ERROR caught by middleware:`
    );
    console.error(`Path: ${req.method} ${req.path}`);
    console.error(`Status: ${status}`);
    console.error(`Message: ${message}`);
    if (errors) {
      console.error(`Validation Errors:`, JSON.stringify(errors, null, 2));
    }
    console.error(`Stack:\n${err.stack}\n`);
  }

  // Response body
  const responseBody: {
    success: false;
    status: number;
    message: string;
    errors?: any[];
  } = {
    success: false,
    status,
    message,
  };

  if (errors) {
    responseBody.errors = errors;
  }

  res.status(status).json(responseBody);
};
