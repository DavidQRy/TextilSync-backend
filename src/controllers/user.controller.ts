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


export const getUserByIDController = async (req: Request, res: Response) => {
  const { id } = req.params
  if (!id) return res.status(400).json({
    message: 'bad request'
  })

  const user = await UserService.getUserByID(id as string)

  if (!user) return res.status(404).json({
    message: 'usuario no encontrado'
  })

  return res.status(200).json({...user})
}

export const updateUserController = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      message: 'Bad request',
    });
  }

  try {
    const result = await UserService.updateUser(id.toString(), req.body);

    return res.status(200).json({
      ok: true,
      data: result,
    });
  } catch (error) {
    if (error instanceof Error) {
      switch (error.message) {
        case 'USER_NOT_FOUND':
          return res.status(404).json({ message: 'User not found' });

        case 'ROLE_NOT_FOUND':
          return res.status(400).json({ message: 'Invalid role' });

        default:
          return res.status(500).json({ message: 'Internal server error' });
      }
    }

    return res.status(500).json({ message: 'Internal server error' });
  }
};