import { prisma } from "#config/prisma";
import bcrypt from "bcrypt";
import { UserCreate, UserUpdateDTO } from "#types/user";

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

    static async listUsersByCompany(companyId: string) {
    const users = await prisma.user.findMany({
      where: {
        companyId,
        active: true,
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        roleId: true,
        active: true
      },
    });

    return users;
  }

  static async getUserByID(userID: string){
    const user = prisma.user.findUnique({
      where: {
        id: userID
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        roleId: true,
        active: true
      }
    })

    return user
  }
  
  static async updateUser(id: string, data: UserUpdateDTO){
    const user = await prisma.user.findUnique({
      where: { id },
    });
  
    if (!user) {
      throw new Error('USER_NOT_FOUND');
    }
  
    if (data.roleId) {
      const roleExists = await prisma.role.findUnique({
        where: { id: data.roleId },
      });
  
      if (!roleExists) {
        throw new Error('ROLE_NOT_FOUND');
      }
    }
  
    const updateData: Record<string, unknown> = {};
  
    if (data.fullName !== undefined) {
      updateData.fullName = data.fullName;
    }
  
    if (data.active !== undefined) {
      updateData.active = data.active;
    }
  
    if (data.roleId !== undefined) {
      updateData.roleId = data.roleId;
    }
  
    if (data.password) {
      updateData.passwordHash = await bcrypt.hash(data.password, 10);
    }
  
    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        fullName: true,
        roleId: true,
        active: true,
        companyId: true,
      },
    });
  
    return updatedUser;
  };
}

