import { describe, it, expect, vi, beforeEach } from "vitest";
import { AuthService } from "#services/auth.service";
import { prisma } from "#config/prisma";
import bcrypt, { compare } from "bcrypt";
import jwt from "jsonwebtoken";
import { UserWithRole } from "#types/user";

vi.mock("#config/prisma", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
    company: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
}));

// Mock de bcrypt - Especificar tipos de retorno
vi.mock("bcrypt", () => ({
  default: {
    hash: vi.fn(),
    compare: vi.fn(),
  },
}));

// Mock de jsonwebtoken
vi.mock("jsonwebtoken", () => ({
  default: {
    sign: vi.fn<() => string>(),
    verify: vi.fn(),
  },
}));

describe("AuthService.register", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should register a new user and company", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);
    vi.mocked(prisma.company.findUnique).mockResolvedValue(null);

    vi.mocked(prisma.company.create).mockResolvedValue({
      id: "uuid",
      name: "ACME",
      taxId: "123",
      createdAt: new Date(),
    });

    vi.mocked(prisma.user.create).mockResolvedValue({
      id: "uuid",
      email: "test@mail.com",
      fullName: "Juan Pérez",
      companyId: "uuid",
      roleId: 1,
      passwordHash: "hashed",
      active: true,
    });

    const result = await AuthService.register({
      user: {
        fullName: "Juan Pérez",
        email: "test@mail.com",
        password: "123456",
      },
      company: {
        name: "ACME",
        taxId: "123",
      },
    });

    expect(result).toEqual({
      id: "uuid",
      email: "test@mail.com",
      fullName: "Juan Pérez",
      companyId: "uuid",
    });
  });

  it("should throw if email already exists", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: "uuid",
      email: "test@mail.com",
      companyId: "uuid",
      fullName: "Juan",
      roleId: 1,
      passwordHash: "hash",
      active: true,
    });

    await expect(
      AuthService.register({
        user: {
          fullName: "Juan",
          email: "test@mail.com",
          password: "123456",
        },
        company: {
          name: "ACME",
          taxId: "123",
        },
      }),
    ).rejects.toThrow("EMAIL_ALREADY_EXISTS");
  });
  it("should throw if company already exists", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

    vi.mocked(prisma.company.findUnique).mockResolvedValue({
      id: "uuid",
      name: "ACME",
      taxId: "123",
      createdAt: new Date("2025-02-19"),
    });

    await expect(
      AuthService.register({
        user: {
          fullName: "Juan",
          email: "test@mail.com",
          password: "123456",
        },
        company: {
          name: "ACME",
          taxId: "123",
        },
      }),
    ).rejects.toThrow("COMPANY_ALREADY_EXISTS");
  });
});

describe("AuthService.login", () => {
    beforeEach(() => {
    vi.clearAllMocks();
  });
  it("should login successfully", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: "uuid",
      email: "test@mail.com",
      fullName: "Juan",
      passwordHash: "hashed",
      active: true,
      companyId: "uuid",
      roleId: 1,
      role: {
        id: 1,
        name: "ADMIN",
      },
    } as UserWithRole | null);

    vi.mocked(bcrypt.compare as ReturnType<typeof vi.fn>).mockReturnValue(true);
    vi.mocked(jwt.sign as ReturnType<typeof vi.fn>).mockReturnValue("jwt-token");

    const result = await AuthService.login("test@mail..com", "123456");

    expect(result.token).toBe("jwt-token");
    expect(result.user.role).toBe("ADMIN");
  });

  it("should throw on invalid credentials", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

    await expect(AuthService.login("x@mail.com", "123")).rejects.toThrow(
      "INVALID_CREDENTIALS",
    );
  });

  it("should throw if user is inactive", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: "uuid",
      email: "test@mail.com",
      fullName: "Juan",
      passwordHash: "hashed",
      active: false,
      roleId: 1,
      role: { name: "ADMIN" },
    } as UserWithRole);

    await expect(AuthService.login("test@mail.com", "123456")).rejects.toThrow(
      "INVALID_CREDENTIALS",
    );
  });

  it("should throw if password is incorrect", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: "uuid",
      email: "test@mail.com",
      fullName: "Juan",
      passwordHash: "hashed",
      active: true,
      roleId: 1,
      role: { name: "ADMIN" },
    } as UserWithRole | null);

    vi.mocked(bcrypt.compare as ReturnType<typeof vi.fn>).mockResolvedValue(false);

    await expect(
      AuthService.login("test@mail.com", "wrong-password"),
    ).rejects.toThrow("INVALID_CREDENTIALS");
  });
});
