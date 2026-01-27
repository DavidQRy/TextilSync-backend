import type { Request, Response } from "express";
import { AuthService } from "#services/auth.service";
import { loginBody } from "#types/login";


export const loginController = async (
  req: Request<{}, {}, loginBody>,
  res: Response
) => {
  return res.json({
    status: 200
  })
};