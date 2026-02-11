import { describe, it, expect, vi, beforeEach } from "vitest";
import { UserService } from "#services/user.service";
import { prisma } from "#config/prisma";
import bcrypt from "bcrypt";

/**
 * Mock de Prisma
 */
vi.mock("#config/prisma", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    role: {
      findUnique: vi.fn(),
    },
  },
}));

/**
 * Mock de bcrypt
 */
vi.mock("bcrypt", () => ({
  default: {
    hash: vi.fn(),
  },
}));

describe("UserService.createUser", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /**
   * Should throw if email already exists
   */
  it("should throw EMAIL_ALREADY_EXISTS", async () => {
    vi.mocked(
      prisma.user.findUnique as ReturnType<typeof vi.fn>,
    ).mockResolvedValueOnce({ id: "1" });

    await expect(
      UserService.createUser(
        {
          email: "test@mail.com",
          fullName: "Test",
          password: "123456",
          roleId: 1,
          companyId: "x",
          active: true,
          id: "x",
        },
        "admin-id",
      ),
    ).rejects.toThrow("EMAIL_ALREADY_EXISTS");
  });

  /**
   * Should create user successfully
   */
  it("should create a user successfully", async () => {
    vi.mocked(prisma.user.findUnique as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce(null) // email
      .mockResolvedValueOnce({ id: "admin-id", companyId: "company-id" }); // admin

    vi.mocked(prisma.role.findUnique).mockResolvedValue({
      id: 1,
      name: "ADMIN",
    });

    vi.mocked(bcrypt.hash as ReturnType<typeof vi.fn>).mockResolvedValue("hashed-password");

    vi.mocked(prisma.user.create as ReturnType<typeof vi.fn>).mockResolvedValue(
      {
        id: "user-id",
        email: "test@mail.com",
        fullName: "Test User",
        companyId: "company-id",
      },
    );

    const result = await UserService.createUser(
      {
        id: "x",
        email: "test@mail.com",
        fullName: "Test User",
        password: "123456",
        roleId: 1,
        companyId: "x",
        active: true,
      },
      "admin-id",
    );

    expect(result.email).toBe("test@mail.com");
  });

  it("should throw ADMIN_USER_NOT_FOUND", async () => {
    vi.mocked(prisma.user.findUnique)
      .mockResolvedValueOnce(null) // email no existe
      .mockResolvedValueOnce(null); // admin no existe

    await expect(
      UserService.createUser(
        {
          id: "x",
          email: "test@mail.com",
          fullName: "Test",
          password: "123456",
          roleId: 1,
          companyId: "x",
          active: true,
        },
        "admin-id",
      ),
    ).rejects.toThrow("ADMIN_USER_NOT_FOUND");
  });

  it("should throw ROLE_NOT_FOUND", async () => {
    vi.mocked(prisma.user.findUnique as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce(null) // email
      .mockResolvedValueOnce({ id: "admin", companyId: "company" }); // admin

    vi.mocked(prisma.role.findUnique).mockResolvedValue(null); // rol no existe

    await expect(
      UserService.createUser(
        {
          id: "x",
          email: "test@mail.com",
          fullName: "Test",
          password: "123456",
          roleId: 99,
          companyId: "x",
          active: true,
        },
        "admin",
      ),
    ).rejects.toThrow("ROLE_NOT_FOUND");
  });

  it("should throw ROLE_NOT_FOUND when role does not exist", async () => {
    vi.mocked(
      prisma.user.findUnique as ReturnType<typeof vi.fn>,
    ).mockResolvedValue({ id: "1" });
    vi.mocked(
      prisma.role.findUnique as ReturnType<typeof vi.fn>,
    ).mockResolvedValue(null);

    await expect(UserService.updateUser("1", { roleId: 99 })).rejects.toThrow(
      "ROLE_NOT_FOUND",
    );
  });
});

describe("UserService.listUsersByCompany", () => {
  it("should return active users by company", async () => {
    vi.mocked(
      prisma.user.findMany as ReturnType<typeof vi.fn>,
    ).mockResolvedValue([
      {
        id: "1",
        email: "a@mail.com",
        fullName: "A",
        roleId: 1,
        active: true,
      },
    ]);

    const users = await UserService.listUsersByCompany("company-id");

    expect(users).toHaveLength(1);
  });
});

describe("UserService.getUserByID", () => {
  it("should return user by id", async () => {
    vi.mocked(
      prisma.user.findUnique as ReturnType<typeof vi.fn>,
    ).mockResolvedValue({
      id: "1",
      email: "test@mail.com",
      fullName: "Test",
      roleId: 1,
      active: true,
    });

    const user = await UserService.getUserByID("1");

    expect(user?.email).toBe("test@mail.com");
  });
});

describe("UserService.updateUser", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /**
   * Should throw if user does not exist
   */
  it("should throw USER_NOT_FOUND", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

    await expect(
      UserService.updateUser("1", { fullName: "New Name" }),
    ).rejects.toThrow("USER_NOT_FOUND");
  });

  /**
   * Should update user successfully
   */
  it("should update user data", async () => {
    vi.mocked(
      prisma.user.findUnique as ReturnType<typeof vi.fn>,
    ).mockResolvedValue({ id: "1" });
    vi.mocked(prisma.user.update as ReturnType<typeof vi.fn>).mockResolvedValue(
      {
        id: "1",
        email: "test@mail.com",
        fullName: "Updated",
        roleId: 1,
        active: true,
        companyId: "company-id",
      },
    );

    const result = await UserService.updateUser("1", {
      fullName: "Updated",
    });

    expect(result.fullName).toBe("Updated");
  });

  it("should hash password when password is provided", async () => {
    vi.mocked(
      prisma.user.findUnique as ReturnType<typeof vi.fn>,
    ).mockResolvedValue({ id: "1" });
    vi.mocked(bcrypt.hash as ReturnType<typeof vi.fn>).mockResolvedValue(
      "hashed",
    );
    vi.mocked(prisma.user.update as ReturnType<typeof vi.fn>).mockResolvedValue(
      {
        id: "1",
        email: "a@mail.com",
        fullName: "Test",
        roleId: 1,
        active: true,
        companyId: "c",
      },
    );

    await UserService.updateUser("1", { password: "newpass" });

    expect(bcrypt.hash).toHaveBeenCalled();
  });

  it("should update active status", async () => {
    vi.mocked(
      prisma.user.findUnique as ReturnType<typeof vi.fn>,
    ).mockResolvedValue({ id: "1" });

    vi.mocked(prisma.user.update as ReturnType<typeof vi.fn>).mockResolvedValue(
      {
        id: "1",
        email: "test@mail.com",
        fullName: "Test",
        roleId: 1,
        active: false,
        companyId: "company-id",
      },
    );

    const result = await UserService.updateUser("1", { active: false });

    expect(result.active).toBe(false);
  });

  it("should update roleId when role exists", async () => {
    vi.mocked(
      prisma.user.findUnique as ReturnType<typeof vi.fn>,
    ).mockResolvedValue({ id: "1" });
    vi.mocked(
      prisma.role.findUnique as ReturnType<typeof vi.fn>,
    ).mockResolvedValue({ id: 2 });

    vi.mocked(prisma.user.update as ReturnType<typeof vi.fn>).mockResolvedValue(
      {
        id: "1",
        email: "test@mail.com",
        fullName: "Test",
        roleId: 2,
        active: true,
        companyId: "company-id",
      },
    );

    const result = await UserService.updateUser("1", { roleId: 2 });

    expect(result.roleId).toBe(2);
  });
});

describe("UserService.deleteUser", () => {
  it("should soft delete user", async () => {
    vi.mocked(prisma.user.findUnique as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce({ id: "admin", companyId: "company" }) // admin
      .mockResolvedValueOnce({
        id: "user",
        companyId: "company",
        active: true,
      });

    vi.mocked(prisma.user.update as ReturnType<typeof vi.fn>).mockResolvedValue(
      {},
    );

    await expect(
      UserService.deleteUser("user", "admin"),
    ).resolves.not.toThrow();
  });

  it("should throw FORBIDDEN if admin does not exist", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

    await expect(UserService.deleteUser("user", "admin")).rejects.toThrow(
      "FORBIDDEN",
    );
  });

  it("should throw USER_NOT_FOUND if user is inactive", async () => {
    vi.mocked(prisma.user.findUnique as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce({ id: "admin", companyId: "c" })
      .mockResolvedValueOnce({ id: "user", active: false });

    await expect(UserService.deleteUser("user", "admin")).rejects.toThrow(
      "USER_NOT_FOUND",
    );
  });

  it("should throw FORBIDDEN if user belongs to another company", async () => {
    vi.mocked(prisma.user.findUnique as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce({ id: "admin", companyId: "A" })
      .mockResolvedValueOnce({ id: "user", companyId: "B", active: true });

    await expect(UserService.deleteUser("user", "admin")).rejects.toThrow(
      "FORBIDDEN",
    );
  });
});
