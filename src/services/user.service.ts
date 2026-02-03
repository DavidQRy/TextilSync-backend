import { prisma } from "#config/prisma";
import bcrypt from "bcrypt";
import { UserCreate } from "#types/user";

export class UserService {
  static async createUser(user: UserCreate, userAdminId: string) {

    const existingUser = await prisma.user.findUnique({
      where: { email: user.email },
    });

    if (existingUser) {
      throw new Error("EMAIL_ALREADY_EXISTS");
    }

    const userAdmin = await prisma.user.findUnique({
      where: { id: userAdminId },
    });

    if (!userAdmin) {
      throw new Error("ADMIN_USER_NOT_FOUND");
    }

    const roleExists = await prisma.role.findUnique({
      where: { id: user.roleId },
    });

    if (!roleExists) {
      throw new Error("ROLE_NOT_FOUND");
    }

    const passwordHash = await bcrypt.hash(user.password, 10);

    const newUser = await prisma.user.create({
      data: {
        fullName: user.fullName,
        email: user.email,
        passwordHash,
        companyId: userAdmin.companyId,
        roleId: user.roleId,
      },
    });

    return {
      id: newUser.id,
      email: newUser.email,
      fullName: newUser.fullName,
      companyId: newUser.companyId,
    };
  }
}
