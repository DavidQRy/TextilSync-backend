import { describe, it, expect, vi, beforeEach } from "vitest";
import { AuthService } from "#services/auth.service";
import { prisma } from "#config/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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

vi.mock("bcrypt", () => ({
  default: {
    hash: vi.fn(),
    compare: vi.fn(),
  },
}));

vi.mock("jsonwebtoken", () => ({
  default: {
    sign: vi.fn(),
  },
}));

describe("AuthService.register", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should register a new user and company", async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    prisma.company.findUnique.mockResolvedValue(null);

    prisma.company.create.mockResolvedValue({
      id: 1,
      name: "ACME",
      taxId: "123",
    });

    prisma.user.create.mockResolvedValue({
      id: 10,
      email: "test@mail.com",
      fullName: "Juan Pérez",
      companyId: 1,
      roleId: 1,
      passwordHash: "hashed",
    });

    vi.mocked(bcrypt.hash).mockResolvedValue("hashed");

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
      id: 10,
      email: "test@mail.com",
      fullName: "Juan Pérez",
      companyId: 1,
    });
  });

  it("should throw if email already exists", async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: 1,
      email: "test@mail.com",
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
      id: 1,
      name: "ACME",
      taxId: "123",
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
  it("should login successfully", async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: 1,
      email: "test@mail.com",
      fullName: "Juan",
      passwordHash: "hashed",
      active: true,
      roleId: 1,
      role: { name: "ADMIN" },
    });

    vi.mocked(bcrypt.compare).mockResolvedValue(true);
    vi.mocked(jwt.sign).mockReturnValue("jwt-token");

    const result = await AuthService.login("test@mail..com", "123456");

    expect(result.token).toBe("jwt-token");
    expect(result.user.role).toBe("ADMIN");
  });

  it("should throw on invalid credentials", async () => {
    prisma.user.findUnique.mockResolvedValue(null);

    await expect(AuthService.login("x@mail.com", "123")).rejects.toThrow(
      "INVALID_CREDENTIALS",
    );
  });

  it("should throw if user is inactive", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: 1,
      email: "test@mail.com",
      fullName: "Juan",
      passwordHash: "hashed",
      active: false, // 👈 rama no cubierta
      roleId: 1,
      role: { name: "ADMIN" },
    });

    await expect(AuthService.login("test@mail.com", "123456")).rejects.toThrow(
      "INVALID_CREDENTIALS",
    );
  });

  it("should throw if password is incorrect", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: 1,
      email: "test@mail.com",
      fullName: "Juan",
      passwordHash: "hashed",
      active: true,
      roleId: 1,
      role: { name: "ADMIN" },
    });

    vi.mocked(bcrypt.compare).mockResolvedValue(false);

    await expect(
      AuthService.login("test@mail.com", "wrong-password"),
    ).rejects.toThrow("INVALID_CREDENTIALS");
  });
});
