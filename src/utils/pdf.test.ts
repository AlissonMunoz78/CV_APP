import * as Print from "expo-print";
import { CVData } from "../../types/cv.types";
import { buildCvHtml, generateAndShareCVPdf } from "./pdf";

// PUNTO 5: Test unitario para validar que el HTML/PDF contiene secciones esperadas.

jest.mock("expo-print", () => ({
  printToFileAsync: jest.fn().mockResolvedValue({ uri: "file:///tmp/cv.pdf" }),
}));

jest.mock("expo-sharing", () => ({
  isAvailableAsync: jest.fn().mockResolvedValue(false),
  shareAsync: jest.fn(),
}));

describe("PDF utilities", () => {
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

  it("buildCvHtml incluye nombre y habilidades", () => {
    const html = buildCvHtml(cvData);

    expect(html).toContain("Ana Perez");
    expect(html).toContain("Habilidades");
    expect(html).toContain("React Native");
    expect(html).toContain("TypeScript");
  });

  it("generateAndShareCVPdf usa expo-print con html dinamico", async () => {
    const uri = await generateAndShareCVPdf(cvData);

    expect(Print.printToFileAsync).toHaveBeenCalledWith(
      expect.objectContaining({ html: expect.stringContaining("Ana Perez") }),
    );
    expect(uri).toBe("file:///tmp/cv.pdf");
  });
});
