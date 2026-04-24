import { describe, expect, it, jest } from "@jest/globals";
import * as Print from "expo-print";
import { CVData } from "../../types/cv.types";
import { buildCvHtml, generateAndShareCVPdf } from "./pdf";

// PUNTO 5: Test unitario para validar que el HTML/PDF contiene secciones esperadas.

// Mock de expo-print para simular la generación de PDF sin usar el dispositivo real
jest.mock("expo-print", () => ({
  printToFileAsync: jest
    .fn<() => Promise<{ uri: string }>>()
    .mockResolvedValue({ uri: "file:///tmp/cv.pdf" }),
}));

// Mock de expo-sharing para evitar compartir realmente el archivo
jest.mock("expo-sharing", () => ({
  isAvailableAsync: jest.fn<() => Promise<boolean>>().mockResolvedValue(false),
  shareAsync: jest
    .fn<(uri: string, options?: unknown) => Promise<void>>()
    .mockResolvedValue(undefined),
}));

function mockFileConstructor(uri: string) {
  const file: { uri: string; rename(newName: string): void } = {
    uri,
    rename(newName: string) {
      file.uri = file.uri.replace(/[^/]+$/, newName);
    },
  };

  return file;
}

jest.mock("expo-file-system", () => ({
  File: mockFileConstructor,
  readAsStringAsync: jest.fn(),
}));

describe("PDF utilities", () => {
  // Datos de prueba simulados (mock del CV)
  const cvData: CVData = {
    personalInfo: {
      fullName: "Ana Perez",
      email: "ana@example.com",
      phone: "0999999999",
      location: "Quito",
      summary: "Ingeniera de software",
    },
    experiences: [],
    education: [],
    skills: [
      { id: "1", name: "React Native", level: "Avanzado" },
      { id: "2", name: "TypeScript", level: "Intermedio" },
    ],
  };

  // Test 1: Verifica que el HTML generado contiene información clave
  it("buildCvHtml incluye nombre y habilidades", () => {
    const html = buildCvHtml(cvData);

    // Validamos que el HTML tenga datos importantes del CV
    expect(html).toContain("Ana Perez");
    expect(html).toContain("Skills");
    expect(html).toContain("Profile");
    expect(html).toContain("React Native");
    expect(html).toContain("TypeScript");
  });

  // Test 2: Verifica que se genera el PDF correctamente
  it("generateAndShareCVPdf usa expo-print con html dinamico", async () => {
    const uri = await generateAndShareCVPdf(cvData);

    // Verifica que se llamó a expo-print con HTML que contiene el nombre
    expect(Print.printToFileAsync).toHaveBeenCalledWith(
      expect.objectContaining({ html: expect.stringContaining("Ana Perez") }),
    );

    // Verifica que retorna la ruta del PDF generado.
    expect(uri).toBe("file:///tmp/cv.pdf");
  });
});
