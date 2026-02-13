import { CompanyService, updateCompany } from "#services/company.service";
import type { Request, Response } from "express";

export const companyController = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });

  try {
    const result = await CompanyService.getCompanyByUserId(req.user.userId);

    return res.status(201).json({
      ok: true,
      data: result,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const companyUpdateController = async (req: Request, res: Response)  => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  try {
    const result = await updateCompany(req.user.userId, req.body);

    return res.status(201).json({
      ok: true,
      data: result,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}