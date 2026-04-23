import * as FileSystem from "expo-file-system";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { CVData } from "../../types/cv.types";

// PUNTO 2: Utilidades de exportacion a PDF con expo-print + expo-sharing.

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const renderExperienceHtml = (cvData: CVData) => {
  if (cvData.experiences.length === 0) {
    return "<p>No se registraron experiencias.</p>";
  }

  return cvData.experiences
    .map(
      (exp) => `
      <div class="item">
        <h3>${escapeHtml(exp.position)}</h3>
        <p><strong>Empresa:</strong> ${escapeHtml(exp.company)}</p>
        <p><strong>Periodo:</strong> ${escapeHtml(exp.startDate)} - ${escapeHtml(exp.endDate || "Actual")}</p>
        ${exp.description ? `<p>${escapeHtml(exp.description)}</p>` : ""}
      </div>
    `,
    )
    .join("");
};

const renderEducationHtml = (cvData: CVData) => {
  if (cvData.education.length === 0) {
    return "<p>No se registraron estudios.</p>";
  }

  return cvData.education
    .map(
      (edu) => `
      <div class="item">
        <h3>${escapeHtml(edu.degree)}</h3>
        <p><strong>Institucion:</strong> ${escapeHtml(edu.institution)}</p>
        ${edu.field ? `<p><strong>Area:</strong> ${escapeHtml(edu.field)}</p>` : ""}
        ${edu.graduationYear ? `<p><strong>Graduacion:</strong> ${escapeHtml(edu.graduationYear)}</p>` : ""}
      </div>
    `,
    )
    .join("");
};

const renderSkillsHtml = (cvData: CVData) => {
  if (cvData.skills.length === 0) {
    return "<p>No se registraron habilidades.</p>";
  }

  return `
    <ul>
      ${cvData.skills
        .map(
          (skill) =>
            `<li><strong>${escapeHtml(skill.name)}</strong> - ${escapeHtml(skill.level)}</li>`,
        )
        .join("")}
    </ul>
  `;
};

const getMimeTypeFromUri = (uri: string) => {
  const cleanUri = uri.split("?")[0].toLowerCase();
  if (cleanUri.endsWith(".png")) return "image/png";
  if (cleanUri.endsWith(".webp")) return "image/webp";
  if (cleanUri.endsWith(".gif")) return "image/gif";
  if (cleanUri.endsWith(".jpg") || cleanUri.endsWith(".jpeg")) return "image/jpeg";
  return "image/jpeg";
};

const resolveProfileImageSource = async (profileImage?: string) => {
  if (!profileImage) return "";

  if (profileImage.startsWith("data:image/")) {
    return profileImage;
  }

  try {
    const base64 = await FileSystem.readAsStringAsync(profileImage, {
      encoding: FileSystem.EncodingType.Base64,
    });
    const mimeType = getMimeTypeFromUri(profileImage);
    return `data:${mimeType};base64,${base64}`;
  } catch {
    // Si falla la conversion, devolvemos la URI original para intentar renderizarla.
    return profileImage;
  }
};

export const buildCvHtml = (cvData: CVData, profileImageSrc?: string) => {
  const { personalInfo } = cvData;
  const profileImageHtml = profileImageSrc
    ? `<img src="${profileImageSrc}" alt="Foto de perfil" class="profile-image" />`
    : "";

  return `
    <html>
      <head>
        <meta charset="UTF-8" />
        <style>
          body { font-family: Arial, sans-serif; padding: 24px; color: #1f2937; }
          h1 { color: #0a2d6e; margin-bottom: 4px; }
          h2 { color: #0a2d6e; border-bottom: 1px solid #d1d5db; padding-bottom: 6px; margin-top: 24px; }
          h3 { margin: 0 0 4px 0; }
          .header { display: flex; align-items: flex-start; justify-content: space-between; gap: 20px; margin-bottom: 16px; }
          .header-left { flex: 1; min-width: 0; }
          .contact { color: #4b5563; margin-bottom: 20px; }
          .profile-image { width: 110px; height: 110px; border-radius: 55px; object-fit: cover; border: 2px solid #0a2d6e; }
          .item { margin-bottom: 14px; padding-bottom: 10px; border-bottom: 1px solid #e5e7eb; }
          p { margin: 4px 0; }
          ul { margin: 8px 0 0 16px; padding: 0; }
          li { margin-bottom: 6px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="header-left">
            <h1>${escapeHtml(personalInfo.fullName || "CV Sin Nombre")}</h1>
            <div class="contact">
              ${personalInfo.email ? `<p><strong>Email:</strong> ${escapeHtml(personalInfo.email)}</p>` : ""}
              ${personalInfo.phone ? `<p><strong>Telefono:</strong> ${escapeHtml(personalInfo.phone)}</p>` : ""}
              ${personalInfo.location ? `<p><strong>Ubicacion:</strong> ${escapeHtml(personalInfo.location)}</p>` : ""}
            </div>
          </div>
          ${profileImageHtml}
        </div>

        <h2>Resumen Profesional</h2>
        <p>${escapeHtml(personalInfo.summary || "Sin resumen profesional")}</p>

        <h2>Experiencia Laboral</h2>
        ${renderExperienceHtml(cvData)}

        <h2>Educacion</h2>
        ${renderEducationHtml(cvData)}

        <h2>Habilidades</h2>
        ${renderSkillsHtml(cvData)}
      </body>
    </html>
  `;
};

export const buildCvHtmlWithResolvedImage = async (cvData: CVData) => {
  const profileImageSrc = await resolveProfileImageSource(
    cvData.personalInfo.profileImage,
  );
  return buildCvHtml(cvData, profileImageSrc);
};

export const generateAndShareCVPdf = async (cvData: CVData) => {
  // Genera PDF desde HTML dinamico y luego abre el share sheet nativo.
  const html = await buildCvHtmlWithResolvedImage(cvData);
  const { uri } = await Print.printToFileAsync({ html });

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(uri, {
      mimeType: "application/pdf",
      dialogTitle: "Compartir CV en PDF",
      UTI: "com.adobe.pdf",
    });
  }

  return uri;
};
