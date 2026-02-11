import { prisma } from "#config/prisma";

export class CompanyService {
  static async getCompanyByUserId(userId: string) {
    const user =  await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) return null
    
    return await prisma.company.findUnique({
        where: {
            id: user.companyId
        }
    })
  }
}


export const getCompanybyUser = async (userId: string) => {
    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        }
    })

    if (!user) return null

    return await prisma.company.findUnique({
        where: {
            id: user.companyId
        }
    })
}