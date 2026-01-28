import type { Request, Response } from "express";
import { AuthService } from "#services/auth.service";
import { loginBody } from "#types/login";

export const loginController = async (
  req: Request,
  res: Response
) => {
  const { email, password } = req.body as loginBody;

  try {
    const result = await AuthService.login(email, password);
    return res.status(200).json(result);
  } catch {
    return res.status(401).json({
      message: 'Credenciales inválidas',
    });
  }
};
