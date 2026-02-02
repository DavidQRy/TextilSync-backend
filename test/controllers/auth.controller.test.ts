import { describe, it, expect, vi, beforeEach } from "vitest";
import { createRequest, createResponse } from "node-mocks-http";
import {
  registerController,
  loginController,
} from "#controllers/auth.controller";
import { AuthService } from "#services/auth.service";

/**
 * Mock del AuthService
 */
vi.mock("#services/auth.service", () => ({
  AuthService: {
    register: vi.fn(),
    login: vi.fn(),
  },
}));

describe("Auth Controller", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /**
   * Should register a user successfully
   */
  it("registerController - should return 201 when registration succeeds", async () => {
    vi.mocked(AuthService.register).mockResolvedValue({
      id: "1",
      email: "test@mail.com",
      fullName: "Juan Pérez",
      companyId: "10",
    });

    const req = createRequest({
      body: {
        user: {
          fullName: "Juan Pérez",
          email: "test@mail.com",
          password: "123456",
        },
        company: {
          name: "ACME",
          taxId: "123",
        },
      },
    });

    const res = createResponse();

    await registerController(req, res);

    expect(res.statusCode).toBe(201);
    expect(res._getJSONData()).toEqual({
      ok: true,
      data: {
        id: "1",
        email: "test@mail.com",
        fullName: "Juan Pérez",
        companyId: "10",
      },
    });
  });

  /**
   * Should return 409 if email already exists
   */
  it("registerController - should return 409 when email already exists", async () => {
    vi.mocked(AuthService.register).mockRejectedValue(
      new Error("EMAIL_ALREADY_EXISTS"),
    );

    const req = createRequest({ body: {} });
    const res = createResponse();

    await registerController(req, res);

    expect(res.statusCode).toBe(409);
    expect(res._getJSONData()).toEqual({
      message: "Email already exists",
    });
  });

  /**
   * Should return 409 if company already exists
   */
  it("registerController - should return 409 when company already exists", async () => {
    vi.mocked(AuthService.register).mockRejectedValue(
      new Error("COMPANY_ALREADY_EXISTS"),
    );

    const req = createRequest({ body: {} });
    const res = createResponse();

    await registerController(req, res);

    expect(res.statusCode).toBe(409);
    expect(res._getJSONData()).toEqual({
      message: "Company already exists",
    });
  });

  /**
   * Should return 500 on unknown error
   */
  it("registerController - should return 500 on unexpected error", async () => {
    vi.mocked(AuthService.register).mockRejectedValue(
      new Error("UNKNOWN_ERROR"),
    );

    const req = createRequest({ body: {} });
    const res = createResponse();

    await registerController(req, res);

    expect(res.statusCode).toBe(500);
    expect(res._getJSONData()).toEqual({
      message: "Internal server error",
    });
  });

  /**
   * Should return 500 when thrown value is not an Error instance
   */
  it("registerController - should return 500 when error is not an Error", async () => {
    vi.mocked(AuthService.register).mockRejectedValue("fatal");

    const req = createRequest({ body: {} });
    const res = createResponse();

    await registerController(req, res);

    expect(res.statusCode).toBe(500);
    expect(res._getJSONData()).toEqual({
      message: "Internal server error",
    });
  });

  /**
   * Should login successfully
   */
  it("loginController - should return 200 when login succeeds", async () => {
    vi.mocked(AuthService.login).mockResolvedValue({
      token: "jwt-token",
      user: {
        id: "1",
        email: "test@mail.com",
        fullName: "Juan",
        role: "ADMIN",
      },
    });

    const req = createRequest({
      body: {
        email: "test@mail.com",
        password: "123456",
      },
    });

    const res = createResponse();

    await loginController(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      token: "jwt-token",
      user: {
        id: "1",
        email: "test@mail.com",
        fullName: "Juan",
        role: "ADMIN",
      },
    });
  });

  /**
   * Should return 401 when login fails
   */
  it("loginController - should return 401 when credentials are invalid", async () => {
    vi.mocked(AuthService.login).mockRejectedValue(
      new Error("INVALID_CREDENTIALS"),
    );

    const req = createRequest({
      body: {
        email: "wrong@mail.com",
        password: "wrong",
      },
    });

    const res = createResponse();

    await loginController(req, res);

    expect(res.statusCode).toBe(401);
    expect(res._getJSONData()).toEqual({
      message: "Credenciales inválidas",
    });
  });
});
