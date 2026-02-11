import { describe, it, expect, vi, beforeEach } from "vitest";
import { CompanyService } from "#services/company.service";
import { getCompanybyUser } from "#services/company.service";
import { prisma } from "#config/prisma";

/**
 * Mock de Prisma
 */
vi.mock("#config/prisma", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
    },
    company: {
      findUnique: vi.fn(),
    },
  },
}));

describe("CompanyService.getCompanyByUserId", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /**
   * Should return null if user does not exist
   */
  it("should return null when user is not found", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

    const result = await CompanyService.getCompanyByUserId("user-id");

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: "user-id" },
    });
    expect(result).toBeNull();
  });

  /**
   * Should return company when user exists
   */
  it("should return company when user exists", async () => {
    vi.mocked(
      prisma.user.findUnique as ReturnType<typeof vi.fn>,
    ).mockResolvedValue({
      id: "user-id",
      companyId: "company-id",
    });

    vi.mocked(prisma.company.findUnique).mockResolvedValue({
      id: "company-id",
      name: "TextilSync SAS",
      taxId: "900123456",
      createdAt: new Date(),
    });

    const result = await CompanyService.getCompanyByUserId("user-id");

    expect(prisma.company.findUnique).toHaveBeenCalledWith({
      where: { id: "company-id" },
    });

    expect(result).toEqual({
      id: "company-id",
      name: "TextilSync SAS",
      taxId: "900123456",
      createdAt: expect.any(Date),
    });
  });
});

describe("getCompanybyUser (function)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /**
   * Should return null if user does not exist
   */
  it("should return null when user is not found", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

    const result = await getCompanybyUser("user-id");

    expect(result).toBeNull();
  });

  /**
   * Should return company when user exists
   */
  it("should return company when user exists", async () => {
    vi.mocked(
      prisma.user.findUnique as ReturnType<typeof vi.fn>,
    ).mockResolvedValue({
      id: "user-id",
      companyId: "company-id",
    });

    vi.mocked(prisma.company.findUnique).mockResolvedValue({
      id: "company-id",
      name: "TextilSync SAS",
      taxId: "900123456",
      createdAt: new Date(),
    });

    const result = await getCompanybyUser("user-id");

    expect(result?.id).toBe("company-id");
    expect(result?.name).toBe("TextilSync SAS");
  });
});
