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

const getInitials = (fullName: string) =>
  fullName
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "CV";

const getRoleLabel = (cvData: CVData) => {
  const firstPosition = cvData.experiences[0]?.position;
  if (firstPosition) return firstPosition;
  return "Perfil Profesional";
};

const renderExperienceHtml = (cvData: CVData) => {
  if (cvData.experiences.length === 0) {
    return '<p class="empty-state">No se registraron experiencias.</p>';
  }

  return cvData.experiences
    .map((exp) => {
      const period = `${escapeHtml(exp.startDate)} - ${escapeHtml(exp.endDate || "Actual")}`;
      return `
      <div class="timeline-item">
        <div class="timeline-dot"></div>
        <div class="entry">
          <div class="entry-header">
            <h3 class="entry-title">${escapeHtml(exp.position)}</h3>
            <span class="entry-date">${period}</span>
          </div>
          <p class="entry-company">${escapeHtml(exp.company)}</p>
          ${exp.description ? `<p class="entry-meta">${escapeHtml(exp.description)}</p>` : ""}
        </div>
      </div>
    `;
    })
    .join("");
};

const renderEducationHtml = (cvData: CVData) => {
  if (cvData.education.length === 0) {
    return '<p class="empty-state">No se registraron estudios.</p>';
  }

  return cvData.education
    .map(
      (edu) => `
      <div class="education-item">
        <p class="education-bullet">• ${escapeHtml(edu.degree)}</p>
        <p class="education-inst">${escapeHtml(edu.institution)}</p>
        ${edu.field ? `<p class="education-meta">${escapeHtml(edu.field)}</p>` : ""}
        ${edu.graduationYear ? `<p class="education-meta">${escapeHtml(edu.graduationYear)}</p>` : ""}
      </div>
    `,
    )
    .join("");
};

const renderSkillsHtml = (cvData: CVData) => {
  if (cvData.skills.length === 0) {
    return '<p class="empty-state">No se registraron habilidades.</p>';
  }

  return `
    <div class="skill-list">
      ${cvData.skills
        .map(
          (skill) => `
            <div class="skill-pill">
              <span>${escapeHtml(skill.name)}</span>
              <small>${escapeHtml(skill.level)}</small>
            </div>
          `,
        )
        .join("")}
    </div>
  `;
};

const getMimeTypeFromUri = (uri: string) => {
  const cleanUri = uri.split("?")[0].toLowerCase();
  if (cleanUri.endsWith(".png")) return "image/png";
  if (cleanUri.endsWith(".webp")) return "image/webp";
  if (cleanUri.endsWith(".gif")) return "image/gif";
  if (cleanUri.endsWith(".jpg") || cleanUri.endsWith(".jpeg")) {
    return "image/jpeg";
  }
  return "image/jpeg";
};

const resolveProfileImageSource = async (profileImage?: string) => {
  if (!profileImage) return "";

  if (profileImage.startsWith("data:image/")) {
    return profileImage;
  }

  try {
    const base64 = await FileSystem.readAsStringAsync(profileImage, {
      encoding: "base64",
    });
    const mimeType = getMimeTypeFromUri(profileImage);
    return `data:${mimeType};base64,${base64}`;
  } catch {
    return profileImage;
  }
};

export const buildCvHtml = (cvData: CVData, profileImageSrc?: string) => {
  const { personalInfo } = cvData;
  const initials = getInitials(personalInfo.fullName || "CV");
  const roleLabel = getRoleLabel(cvData);
  const profileImageHtml = profileImageSrc
    ? `<img src="${profileImageSrc}" alt="Foto de perfil" class="profile-image" />`
    : `<div class="profile-fallback">${escapeHtml(initials)}</div>`;

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>
          * { box-sizing: border-box; }
          body {
            margin: 0;
            background: #e6ebf2;
            color: #1d3557;
            font-family: Arial, sans-serif;
          }
          .page {
            width: 100%;
            max-width: 960px;
            min-height: 1200px;
            margin: 0 auto;
            display: flex;
            background: #fff;
          }
          .sidebar {
            width: 36%;
            background: #3f72af;
            color: #fff;
            padding: 28px 24px 36px 24px;
          }
          .main {
            width: 64%;
            background: #fff;
          }
          .profile-wrap {
            text-align: center;
            margin-bottom: 28px;
          }
          .profile-image,
          .profile-fallback {
            width: 162px;
            height: 162px;
            border-radius: 50%;
            object-fit: cover;
            margin: 0 auto;
            border: 5px solid rgba(255, 255, 255, 0.85);
            display: block;
            background: linear-gradient(135deg, #5f8fc2, #2c5689);
          }
          .profile-fallback {
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 44px;
            font-weight: 800;
            letter-spacing: 1px;
          }
          .main-header {
            background: #1d4f8a;
            color: #fff;
            padding: 28px 30px;
          }
          .name {
            margin: 0;
            font-size: 54px;
            line-height: 1.06;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.4px;
          }
          .subtitle {
            margin: 8px 0 0 0;
            font-size: 21px;
            letter-spacing: 1.4px;
            text-transform: uppercase;
            color: #d9e6f7;
            font-weight: 600;
          }
          .sidebar-section {
            margin-top: 18px;
            border-top: 2px solid rgba(255, 255, 255, 0.55);
            padding-top: 16px;
          }
          .sidebar-title {
            margin: 0 0 12px 0;
            font-size: 17px;
            letter-spacing: 1.6px;
            text-transform: uppercase;
            color: #fff;
            font-weight: 800;
          }
          .contact-item {
            margin: 0 0 12px 0;
            color: #eef3ff;
            font-size: 15px;
            line-height: 1.5;
            display: flex;
            gap: 10px;
            align-items: flex-start;
          }
          .contact-icon {
            width: 20px;
            display: inline-block;
            text-align: center;
          }
          .contact-value {
            display: block;
            word-break: break-word;
          }
          .skill-list {
            display: flex;
            flex-direction: column;
            gap: 8px;
          }
          .skill-pill {
            border-radius: 10px;
            padding: 8px 12px;
            background: rgba(20, 48, 84, 0.18);
            border: 1px solid rgba(255, 255, 255, 0.24);
          }
          .skill-pill span {
            display: block;
            font-size: 15px;
            font-weight: 700;
            margin-bottom: 2px;
          }
          .skill-pill small {
            display: block;
            font-size: 12px;
            color: #e3ebfb;
            text-transform: uppercase;
            letter-spacing: 0.8px;
          }
          .education-item {
            margin-bottom: 10px;
            color: #edf3ff;
          }
          .education-bullet {
            margin: 0;
            font-size: 15px;
            font-weight: 700;
            line-height: 1.35;
          }
          .education-inst,
          .education-meta {
            margin: 2px 0 0 16px;
            font-size: 14px;
            line-height: 1.4;
            color: #e2eaf9;
          }
          .main-content {
            padding: 24px 30px;
          }
          .section {
            margin-bottom: 22px;
          }
          .main-title {
            margin: 0 0 10px 0;
            font-size: 17px;
            color: #173f6d;
            text-transform: uppercase;
            letter-spacing: 1.1px;
            font-weight: 800;
          }
          .title-divider {
            height: 2px;
            background: #2e5d91;
            margin-bottom: 14px;
            opacity: 0.75;
          }
          .summary {
            font-size: 15px;
            line-height: 1.7;
            color: #2f455f;
            margin: 0;
          }
          .timeline {
            position: relative;
            margin-left: 6px;
            padding-left: 24px;
            border-left: 3px solid #2a5f95;
          }
          .timeline-item {
            position: relative;
            margin-bottom: 14px;
          }
          .timeline-dot {
            position: absolute;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: #1c4e83;
            left: -30px;
            top: 7px;
          }
          .entry-header {
            display: flex;
            justify-content: space-between;
            gap: 12px;
            align-items: flex-start;
            margin-bottom: 2px;
          }
          .entry-title {
            margin: 0;
            font-size: 19px;
            color: #133f71;
            font-weight: 800;
          }
          .entry-company {
            margin: 0 0 4px 0;
            font-size: 15px;
            color: #2e5a85;
            font-weight: 700;
          }
          .entry-meta {
            margin: 0;
            color: #2f4964;
            font-size: 14px;
            line-height: 1.55;
          }
          .entry-date {
            font-size: 12px;
            color: #274f7b;
            font-weight: 800;
            white-space: nowrap;
            text-transform: uppercase;
            letter-spacing: 0.8px;
          }
          .empty-state {
            margin: 0;
            color: #59718d;
            font-style: italic;
          }
        </style>
      </head>
      <body>
        <div class="page">
          <aside class="sidebar">
            <div class="profile-wrap">
              ${profileImageHtml}
            </div>

            <section class="sidebar-section">
              <h2 class="sidebar-title">Contact</h2>
              ${personalInfo.phone ? `<p class="contact-item"><span class="contact-icon">☎</span><span class="contact-value">${escapeHtml(personalInfo.phone)}</span></p>` : ""}
              ${personalInfo.email ? `<p class="contact-item"><span class="contact-icon">✉</span><span class="contact-value">${escapeHtml(personalInfo.email)}</span></p>` : ""}
              ${personalInfo.location ? `<p class="contact-item"><span class="contact-icon">⌂</span><span class="contact-value">${escapeHtml(personalInfo.location)}</span></p>` : ""}
            </section>

            <section class="sidebar-section">
              <h2 class="sidebar-title">Habilidades / Skills</h2>
              ${renderSkillsHtml(cvData)}
            </section>

            <section class="sidebar-section">
              <h2 class="sidebar-title">Educacion</h2>
              ${renderEducationHtml(cvData)}
            </section>
          </aside>

          <main class="main">
            <section class="main-header">
              <h1 class="name">${escapeHtml(personalInfo.fullName || "CV Sin Nombre")}</h1>
              <p class="subtitle">${escapeHtml(roleLabel)}</p>
            </section>

            <section class="main-content">
              <section class="section">
                <h2 class="main-title">Acerca de mi / Profile</h2>
                <div class="title-divider"></div>
                <p class="summary">${escapeHtml(personalInfo.summary || "Agrega un resumen profesional para destacar tu perfil y experiencia principal.")}</p>
              </section>

              <section class="section">
                <h2 class="main-title">Experiencia Laboral</h2>
                <div class="title-divider"></div>
                <div class="timeline">
                  ${renderExperienceHtml(cvData)}
                </div>
              </section>
            </section>
          </main>
        </div>
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
