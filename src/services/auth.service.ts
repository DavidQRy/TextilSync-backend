import { prisma } from "#config/prisma";
import { RegisterBody } from "#types/register";
import bcrypt from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";
import { DEFAULT_ROLE_ID, JWT_EXPIRES, JWT_SECRET } from "#config/environment";
import { UserWithRole } from "#types/user";
import { JwtPayload } from "#types/jwt";

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

  static async login(email: string, password: string) {
    const user: UserWithRole | null = await prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });

    if (!user || !user.active) {
      throw new Error("INVALID_CREDENTIALS");
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);

    if (!isValid) {
      throw new Error("INVALID_CREDENTIALS");
    }

    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
      roleId: user.roleId,
    };

    const signOptions: SignOptions = {
      expiresIn: JWT_EXPIRES as SignOptions["expiresIn"],
    };

    const token = jwt.sign(payload as object, String(JWT_SECRET), signOptions);

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role.name,
      },
    };
  }
}
