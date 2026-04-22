import {
    requiredText,
    sanitizeLocation,
    sanitizeName,
    sanitizePhone,
    validateEmail,
    validateFullName,
    validateLocation,
    validatePhone,
} from "./formValidators";

describe("form validators", () => {
  it("valida nombre obligatorio y formato", () => {
    expect(validateFullName("")).toBe("El nombre completo es obligatorio");
    expect(validateFullName("Al")).toBe("Minimo 3 caracteres");
    expect(validateFullName("Ana1")).toBe("Solo se permiten letras");
    expect(validateFullName("Ana Perez")).toBeUndefined();
  });

  it("permite coma en ubicacion", () => {
    expect(validateLocation("Quito, Ecuador")).toBeUndefined();
    expect(validateLocation("Quito # Centro")).toBe(
      "Solo se permiten letras, espacios y coma",
    );
    expect(sanitizeLocation("Quito, Ecuador #1")).toBe("Quito, Ecuador ");
  });

  it("valida email y telefono", () => {
    expect(validateEmail("correo-invalido")).toBe("Ingresa un email valido");
    expect(validateEmail("ana@example.com")).toBeUndefined();

    expect(validatePhone("123")).toBe("Formato invalido. Ej: +593 99 999 9999");
    expect(validatePhone("+593 99 999 9999")).toBeUndefined();
    expect(sanitizePhone("+593-99AB")).toBe("+593-99");
  });

  it("sanitiza nombre y required generico", () => {
    expect(sanitizeName("J0se#")).toBe("Jse");
    expect(requiredText("", "Requerido")).toBe("Requerido");
    expect(requiredText("ok", "Requerido")).toBeUndefined();
  });
});
