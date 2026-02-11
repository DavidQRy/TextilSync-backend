import { describe, it, expect, vi, beforeEach, MockedObject } from "vitest";
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

// Mockeo automático de servicios
vi.mock("#services/user.service");
vi.mock("#services/company.service");

const mockedUserService = UserService as MockedObject<typeof UserService>;
const mockedCompanyService = CompanyService as MockedObject<
  typeof CompanyService
>;

/**
 * Helper para crear contexto de Express mockeado
 */
const createMockContext = (overrides = {}) => {
  const req = httpMocks.createRequest(overrides);
  const res = httpMocks.createResponse();
  return { req, res };
};

describe("User Controllers - High Coverage Suite", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createUserController", () => {
    it("should return 401 if req.user is missing", async () => {
      const { req, res } = createMockContext();
      await createUserController(req, res);
      expect(res.statusCode).toBe(401);
    });

    it("should return 201 on success", async () => {
      vi.mocked(
        mockedUserService.createUser as ReturnType<typeof vi.fn>,
      ).mockResolvedValue({ id: "1" });
      const { req, res } = createMockContext({
        user: { userId: "uid" },
        body: { n: "test" },
      });
      await createUserController(req, res);
      expect(res.statusCode).toBe(201);
    });

    it("should return 409 if EMAIL_ALREADY_EXISTS", async () => {
      mockedUserService.createUser.mockRejectedValue(
        new Error("EMAIL_ALREADY_EXISTS"),
      );
      const { req, res } = createMockContext({ user: { userId: "uid" } });
      await createUserController(req, res);
      expect(res.statusCode).toBe(409);
    });

    it("should return 500 if error is not instance of Error", async () => {
      mockedUserService.createUser.mockRejectedValue(new Error("STRING_ERROR")); // Cubre línea 27 aprox
      const { req, res } = createMockContext({ user: { userId: "uid" } });
      await createUserController(req, res);
      expect(res.statusCode).toBe(500);
    });

    it("should return 500 when the caught error is NOT an instance of Error", async () => {
      // Forzamos un rechazo con un valor primitivo (no es un objeto Error)
      // Esto hará que 'error instanceof Error' sea FALSE
      mockedUserService.createUser.mockRejectedValueOnce(
        "String error, not an instance of Error",
      );

      const { req, res } = createMockContext({
        user: { userId: "admin-id" },
        body: { email: "test@mail.com" },
      });

      await createUserController(req, res);

      // Verificaciones
      expect(res.statusCode).toBe(500);
      expect(res._getJSONData().message).toBe("Internal server error");
    });
  });

  describe("getUsersController", () => {
    it("should return 401 if req.user is missing", async () => {
      const { req, res } = createMockContext();
      await getUsersController(req, res);
      expect(res.statusCode).toBe(401);
    });

    it("should throw error if company not found (Línea 42)", async () => {
      mockedCompanyService.getCompanyByUserId.mockResolvedValue(null);
      const { req, res } = createMockContext({ user: { userId: "uid" } });
      // El controlador hace un throw directo, por lo que esperamos el rechazo
      await expect(getUsersController(req, res)).rejects.toThrow();
    });

    it("should return 200 with users list", async () => {
      vi.mocked(
        mockedCompanyService.getCompanyByUserId as ReturnType<typeof vi.fn>,
      ).mockResolvedValue({ id: "c1" });
      mockedUserService.listUsersByCompany.mockResolvedValue([]);
      const { req, res } = createMockContext({ user: { userId: "uid" } });
      await getUsersController(req, res);
      expect(res.statusCode).toBe(200);
    });
  });

  describe("getUserByIDController", () => {
    it("should return 400 if id param is missing", async () => {
      const { req, res } = createMockContext({ params: {} });
      await getUserByIDController(req, res);
      expect(res.statusCode).toBe(400);
    });

    it("should return 404 if user is null", async () => {
      mockedUserService.getUserByID.mockResolvedValue(null);
      const { req, res } = createMockContext({ params: { id: "1" } });
      await getUserByIDController(req, res);
      expect(res.statusCode).toBe(404);
    });

    it("should return 200 if user exists", async () => {
      vi.mocked(
        mockedUserService.getUserByID as ReturnType<typeof vi.fn>,
      ).mockResolvedValue({ id: "1", email: "a@a.com" });
      const { req, res } = createMockContext({ params: { id: "1" } });
      await getUserByIDController(req, res);
      expect(res.statusCode).toBe(200);
    });
  });

  describe("updateUserController", () => {
    it("should return 400 if id is missing", async () => {
      const { req, res } = createMockContext({ params: {} });
      await updateUserController(req, res);
      expect(res.statusCode).toBe(400);
    });

    it("should return 200 on update success", async () => {
      vi.mocked(
        mockedUserService.updateUser as ReturnType<typeof vi.fn>,
      ).mockResolvedValue({ id: "1" });
      const { req, res } = createMockContext({ params: { id: "1" }, body: {} });
      await updateUserController(req, res);
      expect(res.statusCode).toBe(200);
    });

    it("should handle switch cases and default (Líneas 87-95)", async () => {
      const cases = [
        { msg: "USER_NOT_FOUND", status: 404 },
        { msg: "ROLE_NOT_FOUND", status: 400 },
        { msg: "OTHER_ERROR", status: 500 }, // Cubre el default del switch
      ];

      for (const item of cases) {
        mockedUserService.updateUser.mockRejectedValueOnce(new Error(item.msg));
        const { req, res } = createMockContext({ params: { id: "1" } });
        await updateUserController(req, res);
        expect(res.statusCode).toBe(item.status);
      }
    });

    it("should return 500 if error is not instance of Error (Línea 99)", async () => {
      mockedUserService.updateUser.mockRejectedValue("NOT_AN_OBJ");
      const { req, res } = createMockContext({ params: { id: "1" } });
      await updateUserController(req, res);
      expect(res.statusCode).toBe(500);
    });
  });

  describe("deleteUserController", () => {
    it("should return 400 if id is missing", async () => {
      const { req, res } = createMockContext({ params: {} });
      await deleteUserController(req, res);
      expect(res.statusCode).toBe(400);
    });

    it("should return 401 if req.user is missing", async () => {
      const { req, res } = createMockContext({ params: { id: "1" } });
      await deleteUserController(req, res);
      expect(res.statusCode).toBe(401);
    });

    it("should return 204 on success", async () => {
      vi.mocked(
        mockedUserService.deleteUser as ReturnType<typeof vi.fn>,
      ).mockResolvedValue(undefined);
      const { req, res } = createMockContext({
        params: { id: "1" },
        user: { userId: "uid" },
      });
      await deleteUserController(req, res);
      expect(res.statusCode).toBe(204);
    });

    it("should handle error messages (404 and 403)", async () => {
      const errors = ["USER_NOT_FOUND", "FORBIDDEN"];
      const statuses = [404, 403];

      for (let i = 0; i < errors.length; i++) {
        mockedUserService.deleteUser.mockRejectedValueOnce(
          new Error(errors[i]),
        );
        const { req, res } = createMockContext({
          params: { id: "1" },
          user: { userId: "uid" },
        });
        await deleteUserController(req, res);
        expect(res.statusCode).toBe(statuses[i]);
      }
    });

    it("should return 500 if error is not Error or unknown (Líneas 124, 128)", async () => {
      // Caso 1: Error desconocido (instancia de Error pero sin mensaje matcheado)
      mockedUserService.deleteUser.mockRejectedValueOnce(new Error("UNKNOWN"));
      let ctx = createMockContext({
        params: { id: "1" },
        user: { userId: "uid" },
      });
      await deleteUserController(ctx.req, ctx.res);
      expect(ctx.res.statusCode).toBe(500);

      // Caso 2: No es instancia de Error (Línea 124)
      mockedUserService.deleteUser.mockRejectedValueOnce({ some: "object" });
      ctx = createMockContext({ params: { id: "1" }, user: { userId: "uid" } });
      await deleteUserController(ctx.req, ctx.res);
      expect(ctx.res.statusCode).toBe(500);
    });
  });
});
