import { describe, it, expect } from "vitest";
import { updateCompanySchema } from "#schemas/company.schema";

describe("updateCompanySchema", () => {
  /**
   *  Casos válidos
   */
  it("should validate when only name is provided", () => {
    const result = updateCompanySchema.validate({
      name: "My Company",
    });

    expect(result.error).toBeUndefined();
  });

  it("should validate when only taxId is provided", () => {
    const result = updateCompanySchema.validate({
      taxId: "123456789",
    });

    expect(result.error).toBeUndefined();
  });

  it("should validate when both name and taxId are provided", () => {
    const result = updateCompanySchema.validate({
      name: "My Company",
      taxId: "123456789",
    });

    expect(result.error).toBeUndefined();
  });

  /**
   *  Reglas de min(1)
   */
  it("should fail if no fields are provided", () => {
    const result = updateCompanySchema.validate({});

    expect(result.error).toBeDefined();
    expect(result.error?.details[0].type).toBe("object.min");
  });

  /**
   *  name validations
   */
  it("should fail if name is empty", () => {
    const result = updateCompanySchema.validate({
      name: "",
    });

    expect(result.error).toBeDefined();
    expect(result.error?.details[0].message).toBe(
      "El nombre de la empresa es obligatorio"
    );
  });

  it("should fail if name is too short", () => {
    const result = updateCompanySchema.validate({
      name: "A",
    });

    expect(result.error).toBeDefined();
  });

  it("should fail if name is too long", () => {
    const result = updateCompanySchema.validate({
      name: "A".repeat(151),
    });

    expect(result.error).toBeDefined();
  });

  /**
   *  taxId validations
   */
  it("should fail if taxId is empty", () => {
    const result = updateCompanySchema.validate({
      taxId: "",
    });

    expect(result.error).toBeDefined();
    expect(result.error?.details[0].message).toBe(
      "El NIT / Tax ID es obligatorio"
    );
  });

  it("should fail if taxId is too short", () => {
    const result = updateCompanySchema.validate({
      taxId: "12",
    });

    expect(result.error).toBeDefined();
  });

  it("should fail if taxId is too long", () => {
    const result = updateCompanySchema.validate({
      taxId: "A".repeat(51),
    });

    expect(result.error).toBeDefined();
  });

  /**
   *  unknown(false)
   */
  it("should fail if unknown field is provided", () => {
    const result = updateCompanySchema.validate({
      name: "Company",
      unknownField: "value",
    });

    expect(result.error).toBeDefined();
    expect(result.error?.details[0].type).toBe("object.unknown");
  });

  /**
   *  tipos incorrectos
   */
  it("should fail if name is not a string", () => {
    const result = updateCompanySchema.validate({
      name: 123,
    });

    expect(result.error).toBeDefined();
  });

  it("should fail if taxId is not a string", () => {
    const result = updateCompanySchema.validate({
      taxId: 999,
    });

    expect(result.error).toBeDefined();
  });
});
