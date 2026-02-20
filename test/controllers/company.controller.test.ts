import { describe, it, expect, vi, beforeEach } from "vitest";
import { createRequest, createResponse } from "node-mocks-http";
import {
  companyController,
  companyUpdateController,
} from "#controllers/company.controller";
import {
  CompanyService,
  getCompanybyUser,
  updateCompany,
} from "#services/company.service";

/**
 * Mock de CompanyService
 */
vi.mock("#services/company.service", () => ({
  CompanyService: {
    getCompanyByUserId: vi.fn(),
  },
  getCompanybyUser: vi.fn(),
  updateCompany: vi.fn(),
}));

describe("Company Controller", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /**
   * GET /company/me
   */

  it("companyController - should return 401 if not authenticated", async () => {
    const req = createRequest();
    const res = createResponse();

    await companyController(req, res);

    expect(res.statusCode).toBe(401);
    expect(res._getJSONData()).toEqual({
      message: "Unauthorized",
    });
  });

  it("companyController - should return company data successfully", async () => {
    vi.mocked(CompanyService.getCompanyByUserId).mockResolvedValue({
      id: "company-id",
      name: "TextilSync SAS",
      taxId: "900123456",
      createdAt: new Date(),
    });

    const req = createRequest({
      user: { userId: "user-id" },
    });

    const res = createResponse();

    await companyController(req, res);

    expect(CompanyService.getCompanyByUserId).toHaveBeenCalledWith("user-id");
    expect(res.statusCode).toBe(201);
    expect(res._getJSONData()).toEqual({
      ok: true,
      data: {
        id: "company-id",
        name: "TextilSync SAS",
        taxId: "900123456",
        createdAt: expect.any(String),
      },
    });
  });

  it("companyController - should return 500 on unexpected error", async () => {
    vi.mocked(CompanyService.getCompanyByUserId).mockRejectedValue(
      new Error("DB_ERROR"),
    );

    const req = createRequest({
      user: { userId: "user-id" },
    });

    const res = createResponse();

    await companyController(req, res);

    expect(res.statusCode).toBe(500);
    expect(res._getJSONData()).toEqual({
      message: "Internal server error",
    });
  });

  /**
   * PUT /company
   */

  it("companyUpdateController - should return 401 if not authenticated", async () => {
    const req = createRequest();
    const res = createResponse();

    await companyUpdateController(req, res);

    expect(res.statusCode).toBe(401);
    expect(res._getJSONData()).toEqual({
      message: "Unauthorized",
    });
  });

  it("companyUpdateController - should return 404 if company not found", async () => {
    vi.mocked(getCompanybyUser).mockResolvedValue(null);

    const req = createRequest({
      user: { userId: "user-id" },
      body: { name: "New Name" },
    });

    const res = createResponse();

    await companyUpdateController(req, res);

    expect(getCompanybyUser).toHaveBeenCalledWith("user-id");
    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({
      message: "Company not found",
    });
  });

  it("companyUpdateController - should update company successfully", async () => {
    vi.mocked(getCompanybyUser).mockResolvedValue({
      id: "company-id",
      name: "TextilSync SAS",
      taxId: "900123456",
      createdAt: new Date(),
    });

    vi.mocked(updateCompany).mockResolvedValue({
      id: "company-id",
      name: "TextilSync SAS",
      taxId: "900123456",
      createdAt: new Date(),
    });

    const req = createRequest({
      user: { userId: "user-id" },
      body: { name: "TextilSync SAS" },
    });

    const res = createResponse();

    await companyUpdateController(req, res);

    expect(updateCompany).toHaveBeenCalledWith("company-id", {
      name: "TextilSync SAS",
    });

    expect(res.statusCode).toBe(201);
    expect(res._getJSONData()).toEqual({
      ok: true,
      data: {
        id: "company-id",
        name: "TextilSync SAS",
        taxId: "900123456",
        createdAt: expect.any(String),
      },
    });
  });

  it("companyUpdateController - should return 500 on unexpected error", async () => {
    vi.mocked(getCompanybyUser).mockResolvedValue({
      id: "company-id",
      name: "TextilSync SAS",
      taxId: "900123456",
      createdAt: new Date(),
    });

    vi.mocked(updateCompany).mockRejectedValue(
      new Error("UPDATE_FAILED"),
    );

    const req = createRequest({
      user: { userId: "user-id" },
      body: { name: "New Name" },
    });

    const res = createResponse();

    await companyUpdateController(req, res);

    expect(res.statusCode).toBe(500);
    expect(res._getJSONData()).toEqual({
      message: "Internal server error",
    });
  });
});
