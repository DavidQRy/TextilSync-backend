import { describe, it, expect, vi, beforeEach } from "vitest";
import httpMocks from "node-mocks-http";

import {
  createUserController,
  getUsersController,
  getUserByIDController,
  deleteUserController,
  updateUserController,
} from "#controllers/user.controller";

import { UserService } from "#services/user.service";
import { CompanyService } from "#services/company.service";

/**
 * Mocks de servicios
 */
vi.mock("#services/user.service", () => ({
  UserService: {
    createUser: vi.fn(),
    listUsersByCompany: vi.fn(),
    getUserByID: vi.fn(),
    updateUser: vi.fn(),
    deleteUser: vi.fn(),
  },
}));

vi.mock("#services/company.service", () => ({
  CompanyService: {
    getCompanyByUserId: vi.fn(),
  },
}));

describe("createUserController", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 401 if not authenticated", async () => {
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();

    await createUserController(req, res);

    expect(res.statusCode).toBe(401);
  });

  it("should create user successfully", async () => {
    vi.mocked(UserService.createUser).mockResolvedValue({
      id: "1",
      email: "test@mail.com",
      fullName: "Test",
      companyId: "company",
    });

    const req = httpMocks.createRequest({
      body: { email: "test@mail.com" },
      user: { userId: "admin-id" },
    });

    const res = httpMocks.createResponse();

    await createUserController(req, res);

    expect(res.statusCode).toBe(201);
    expect(res._getJSONData().ok).toBe(true);
  });

  it("should return 409 if email exists", async () => {
    vi.mocked(UserService.createUser).mockRejectedValue(
      new Error("EMAIL_ALREADY_EXISTS"),
    );

    const req = httpMocks.createRequest({
      body: {},
      user: { userId: "admin-id" },
    });

    const res = httpMocks.createResponse();

    await createUserController(req, res);

    expect(res.statusCode).toBe(409);
  });

  it("should return 500 on unexpected error", async () => {
    vi.mocked(UserService.createUser).mockRejectedValue(new Error("ANY_ERROR"));

    const req = httpMocks.createRequest({
      body: {},
      user: { userId: "admin-id" },
    });

    const res = httpMocks.createResponse();

    await createUserController(req, res);

    expect(res.statusCode).toBe(500);
  });

  it("should pass auth guard and return 201 without touching catch", async () => {
    vi.mocked(
      UserService.createUser as ReturnType<typeof vi.fn>,
    ).mockResolvedValue({ id: "1" });

    const req = httpMocks.createRequest({
      body: {},
      user: { userId: "admin" },
    });

    const res = httpMocks.createResponse();

    await createUserController(req, res);

    expect(res.statusCode).toBe(201);
  });

  it("should return 500 if thrown value is not an Error", async () => {
    vi.mocked(UserService.createUser).mockRejectedValue("NOT_AN_ERROR");

    const req = httpMocks.createRequest({
      body: {},
      user: { userId: "admin" },
    });

    const res = httpMocks.createResponse();

    await createUserController(req, res);

    expect(res.statusCode).toBe(500);
  });
});

describe("getUsersController", () => {
  it("should return users by company", async () => {
    vi.mocked(
      CompanyService.getCompanyByUserId as ReturnType<typeof vi.fn>,
    ).mockResolvedValue({
      id: "company-id",
    });

    vi.mocked(UserService.listUsersByCompany).mockResolvedValue([]);

    const req = httpMocks.createRequest({
      user: { userId: "user-id" },
    });

    const res = httpMocks.createResponse();

    await getUsersController(req, res);

    expect(res.statusCode).toBe(200);
  });

  it("should throw error if company not found", async () => {
    vi.mocked(CompanyService.getCompanyByUserId).mockResolvedValue(null);

    const req = httpMocks.createRequest({
      user: { userId: "user-id" },
    });

    const res = httpMocks.createResponse();

    await expect(getUsersController(req, res)).rejects.toThrow(
      "Accion imposible de realizar",
    );
  });

  it("should return 200 if user exists", async () => {
    vi.mocked(
      UserService.getUserByID as ReturnType<typeof vi.fn>,
    ).mockResolvedValue({
      id: "1",
      email: "test@mail.com",
    });

    const req = httpMocks.createRequest({
      params: { id: "1" },
    });

    const res = httpMocks.createResponse();

    await getUserByIDController(req, res);

    expect(res.statusCode).toBe(200);
  });
});

describe("getUserByIDController", () => {
  it("should return 404 if user not found", async () => {
    vi.mocked(UserService.getUserByID).mockResolvedValue(null);

    const req = httpMocks.createRequest({
      params: { id: "1" },
    });

    const res = httpMocks.createResponse();

    await getUserByIDController(req, res);

    expect(res.statusCode).toBe(404);
  });
  it("should return 400 if id param is missing", async () => {
    const req = httpMocks.createRequest({
      params: {},
    });

    const res = httpMocks.createResponse();

    await getUserByIDController(req, res);

    expect(res.statusCode).toBe(400);
  });
});

describe("updateUserController", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 400 if id is missing", async () => {
    const req = httpMocks.createRequest({ params: {} });
    const res = httpMocks.createResponse();

    await updateUserController(req, res);

    expect(res.statusCode).toBe(400);
  });

  it("should update user successfully", async () => {
    vi.mocked(
      UserService.updateUser as ReturnType<typeof vi.fn>,
    ).mockResolvedValue({
      id: "1",
      email: "updated@mail.com",
    });

    const req = httpMocks.createRequest({
      params: { id: "1" },
      body: { email: "updated@mail.com" },
    });

    const res = httpMocks.createResponse();

    await updateUserController(req, res);

    expect(res.statusCode).toBe(200);
  });

  it("should return 404 if user not found", async () => {
    vi.mocked(UserService.updateUser).mockRejectedValue(
      new Error("USER_NOT_FOUND"),
    );

    const req = httpMocks.createRequest({
      params: { id: "1" },
      body: {},
    });

    const res = httpMocks.createResponse();

    await updateUserController(req, res);

    expect(res.statusCode).toBe(404);
  });

  it("should return 400 if role not found", async () => {
    vi.mocked(UserService.updateUser).mockRejectedValue(
      new Error("ROLE_NOT_FOUND"),
    );

    const req = httpMocks.createRequest({
      params: { id: "1" },
      body: {},
    });

    const res = httpMocks.createResponse();

    await updateUserController(req, res);

    expect(res.statusCode).toBe(400);
  });

  it("should return 500 on unknown error", async () => {
    vi.mocked(UserService.updateUser).mockRejectedValue(new Error("ANY_ERROR"));

    const req = httpMocks.createRequest({
      params: { id: "1" },
      body: {},
    });

    const res = httpMocks.createResponse();

    await updateUserController(req, res);

    expect(res.statusCode).toBe(500);
  });

  it("should return 500 if thrown value is not Error", async () => {
    vi.mocked(UserService.updateUser).mockRejectedValue("SOMETHING_WEIRD"); // ❌ no es Error

    const req = httpMocks.createRequest({
      params: { id: "1" },
      body: {},
    });

    const res = httpMocks.createResponse();

    await updateUserController(req, res);

    expect(res.statusCode).toBe(500);
  });
});

describe("deleteUserController", () => {
  it("should delete user", async () => {
    vi.mocked(UserService.deleteUser).mockResolvedValue(undefined);

    const req = httpMocks.createRequest({
      params: { id: "1" },
      user: { userId: "admin" },
    });

    const res = httpMocks.createResponse();

    await deleteUserController(req, res);

    expect(res.statusCode).toBe(204);
  });
  it("should return 400 if id is missing", async () => {
    const req = httpMocks.createRequest({ params: {} });
    const res = httpMocks.createResponse();

    await deleteUserController(req, res);

    expect(res.statusCode).toBe(400);
  });

  it("should return 404 if user not found", async () => {
    vi.mocked(UserService.deleteUser).mockRejectedValue(
      new Error("USER_NOT_FOUND"),
    );

    const req = httpMocks.createRequest({
      params: { id: "1" },
      user: { userId: "admin" },
    });

    const res = httpMocks.createResponse();

    await deleteUserController(req, res);

    expect(res.statusCode).toBe(404);
  });

  it("should return 403 if forbidden", async () => {
    vi.mocked(UserService.deleteUser).mockRejectedValue(new Error("FORBIDDEN"));

    const req = httpMocks.createRequest({
      params: { id: "1" },
      user: { userId: "admin" },
    });

    const res = httpMocks.createResponse();

    await deleteUserController(req, res);

    expect(res.statusCode).toBe(403);
  });

  it("should return 401 if not authenticated", async () => {
    const req = httpMocks.createRequest({
      params: { id: "1" },
    });

    const res = httpMocks.createResponse();

    await deleteUserController(req, res);

    expect(res.statusCode).toBe(401);
  });

  it("should return 500 if deleteUser throws non-Error", async () => {
    vi.mocked(UserService.deleteUser).mockRejectedValue("UNKNOWN_ERROR");

    const req = httpMocks.createRequest({
      params: { id: "1" },
      user: { userId: "admin" },
    });

    const res = httpMocks.createResponse();

    await deleteUserController(req, res);

    expect(res.statusCode).toBe(500);
  });
  it("should return 401 if user is missing but id exists", async () => {
    const req = httpMocks.createRequest({
      params: { id: "1" }, // 👈 CLAVE
    });

    const res = httpMocks.createResponse();

    await deleteUserController(req, res);

    expect(res.statusCode).toBe(401);
  });
});
