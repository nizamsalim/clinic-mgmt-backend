import { Response } from "express";

export default function internalServerError(res: Response, err: Error) {
  console.log(err);
  return res.status(500).json({
    success: false,
    statusCode: 500,
    error: "Internal Server Error",
  });
}
