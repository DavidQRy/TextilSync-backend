import type { Request, Response } from "express";
import { UserService } from "#services/user.service";
import { UserCreate } from "#types/user";
import { CompanyService } from "#services/company.service";

export const createUserController = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });

  try {
    const result = await UserService.createUser(req.body, req.user.userId);

    return res.status(201).json({
      ok: true,
      data: result,
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "EMAIL_ALREADY_EXISTS") {
        return res.status(409).json({ message: "Email already exists" });
      }
    }

    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getUsersController = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });

  const userId = req.user.userId;

  const company   = await CompanyService.getCompanyByUserId(userId);

  if (!company) throw new Error('Accion imposible de realizar no se encuentra la empresa')
    
  const users = await UserService.listUsersByCompany(company.id);

  return res.status(200).json({
    ok: true,
    data: users,
  });
};
