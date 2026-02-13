import { prisma } from "#config/prisma";
import { CompanyUpdateDTO } from "#types/company";

export class CompanyService {
  static async getCompanyByUserId(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) return null;

    return await prisma.company.findUnique({
      where: {
        id: user.companyId,
      },
    });
  }
}

export const getCompanybyUser = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) return null;

  return await prisma.company.findUnique({
    where: {
      id: user.companyId,
    },
  });
};

export const updateCompany = async (id: string, data: CompanyUpdateDTO) => {
  const comany = await prisma.company.findUnique({
    where: { id },
  });

  if (!comany) {
    throw new Error("COMPANY_NOT_FOUND");
  }

  const updateData: Record<string, unknown> = {};

  if (data.name !== undefined) {
    updateData.name = data.name;
  }

  if (data.taxId !== undefined) {
    updateData.taxId = data.taxId;
  }


  const updateCompany = await prisma.company.update({
    where: { id },
    data: updateData,
  });

  return updateCompany;
};
