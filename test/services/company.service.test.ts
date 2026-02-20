import { describe, it, expect, vi, beforeEach } from "vitest";
import { CompanyService, updateCompany } from "#services/company.service";
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
      update: vi.fn(),
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

describe("CompanyService.updateCompany", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /**
   *  Should throw error if company does not exist
   */
  it("should throw COMPANY_NOT_FOUND if company does not exist", async () => {
    vi.mocked(prisma.company.findUnique).mockResolvedValue(null);

    await expect(
      updateCompany("company-id", { name: "New Name" })
    ).rejects.toThrow("COMPANY_NOT_FOUND");

    expect(prisma.company.findUnique).toHaveBeenCalledWith({
      where: { id: "company-id" },
    });

    expect(prisma.company.update).not.toHaveBeenCalled();
  });

  /**
   *  Should update only name
   */
  it("should update only company name", async () => {
    vi.mocked(prisma.company.findUnique).mockResolvedValue({
      id: "company-id",
      name: "Old Name",
      taxId: "900123456",
      createdAt: new Date
    });

    vi.mocked(prisma.company.update).mockResolvedValue({
      id: "company-id",
      name: "New Name",
      taxId: "900123456",
      createdAt: new Date
    });

    const result = await updateCompany("company-id", {
      name: "New Name",
    });

    expect(prisma.company.update).toHaveBeenCalledWith({
      where: { id: "company-id" },
      data: { name: "New Name" },
    });

    expect(result.name).toBe("New Name");
    expect(result.taxId).toBe("900123456");
  });

  /**
   *  Should update only taxId
   */
  it("should update only company taxId", async () => {
    vi.mocked(prisma.company.findUnique).mockResolvedValue({
      id: "company-id",
      name: "Company",
      taxId: "900123456",
      createdAt: new Date
    });

    vi.mocked(prisma.company.update).mockResolvedValue({
      id: "company-id",
      name: "Company",
      taxId: "800999888",
      createdAt: new Date
    });

    const result = await updateCompany("company-id", {
      taxId: "800999888",
    });

    expect(prisma.company.update).toHaveBeenCalledWith({
      where: { id: "company-id" },
      data: { taxId: "800999888" },
    });

    expect(result.taxId).toBe("800999888");
  });

  /**
   *  Should update name and taxId
   */
  it("should update name and taxId", async () => {
    vi.mocked(prisma.company.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: "company-id",
      name: "Old Name",
      taxId: "900123456",
    });

    vi.mocked(prisma.company.update as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: "company-id",
      name: "New Name",
      taxId: "800999888",
    });

    const result = await updateCompany("company-id", {
      name: "New Name",
      taxId: "800999888",
    });

    expect(prisma.company.update).toHaveBeenCalledWith({
      where: { id: "company-id" },
      data: {
        name: "New Name",
        taxId: "800999888",
      },
    });

    expect(result).toEqual({
      id: "company-id",
      name: "New Name",
      taxId: "800999888",
    });
  });
});