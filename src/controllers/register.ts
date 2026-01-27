import type { Request, Response } from "express";
import { AuthService } from "#services/auth.service";
import { RegisterBody } from "#types/register";

export const registerController = async (
  req: Request<{}, {}, RegisterBody>,
  res: Response
) => {
  try {
    const result = await AuthService.register(req.body);

    return res.status(201).json({
      ok: true,
      data: result,
    });
  } catch (error: any) {
    if (error.message === "EMAIL_ALREADY_EXISTS") {
      return res.status(409).json({ message: "Email already exists" });
    }

    if (error.message === "COMPANY_ALREADY_EXISTS") {
      return res.status(409).json({ message: "Company already exists" });
    }

    return res.status(500).json({ message: "Internal server error" });
  }
};