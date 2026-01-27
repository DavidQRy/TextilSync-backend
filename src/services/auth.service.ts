import { prisma } from "#config/prisma";
import { RegisterBody } from "#types/register";
import bcrypt from 'bcrypt' 
import { DEFAULT_ROLE_ID } from "#config/environment";


export class AuthService {
  static async register(data: RegisterBody) {
    const { user, company } = data;

    // 1. Validar email único
    const existingUser = await prisma.user.findUnique({
      where: { email: user.email },
    });

    if (existingUser) {
      throw new Error("EMAIL_ALREADY_EXISTS");
    }

    // 2. Validar taxId único
    const existingCompany = await prisma.company.findUnique({
      where: { taxId: company.taxId },
    });

    if (existingCompany) {
      throw new Error("COMPANY_ALREADY_EXISTS");
    }

    // 3. Crear empresa
    const newCompany = await prisma.company.create({
      data: {
        name: company.name,
        taxId: company.taxId,
      },
    });

    // 4. Hash de password
    const passwordHash = await bcrypt.hash(user.password, 10);

    // 5. Crear usuario
    const newUser = await prisma.user.create({
      data: {
        fullName: user.fullName,
        email: user.email,
        passwordHash,
        companyId: newCompany.id,
        roleId: Number(DEFAULT_ROLE_ID),
      },
    });

    // 6. Retorno limpio (sin password)
    return {
      id: newUser.id,
      email: newUser.email,
      fullName: newUser.fullName,
      companyId: newCompany.id,
    };
  }
}