import { RegisterBody } from "#types/register";
import type { Request, Response } from "express";


export const registerController = (
  req: Request<{}, {}, RegisterBody>,
  res: Response
) => {
  const { user, company } = req.body;

  // req.body YA está validado y tipado
  res.json({ ok: true });
};
