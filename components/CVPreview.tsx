import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    View,
    useWindowDimensions,
} from "react-native";
import { CVData } from "../types/cv.types";

interface CVPreviewProps {
  cvData: CVData;
}

export const CVPreview = ({ cvData }: CVPreviewProps) => {
  const { personalInfo, experiences, education, skills } = cvData;
  const { width } = useWindowDimensions();
  const isNarrowScreen = width < 760;

  const initials =
    personalInfo.fullName
      ?.trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") || "CV";

  const roleLabel = experiences[0]?.position || "Perfil Profesional";

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.content}>
        <View style={[styles.page, isNarrowScreen && styles.pageStacked]}>
          <View
            style={[styles.sidebar, isNarrowScreen && styles.sidebarStacked]}
          >
            <View style={styles.profileWrap}>
              {personalInfo.profileImage ? (
                <Image
                  source={{ uri: personalInfo.profileImage }}
                  style={styles.profileImage}
                />
              ) : (
                <View style={styles.profileFallback}>
                  <Text style={styles.profileFallbackText}>{initials}</Text>
                </View>
              )}
            </View>

            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarTitle}>Contacto</Text>
              {personalInfo.phone && (
                <View style={styles.contactRow}>
                  <MaterialIcons name="phone" size={18} color="#eef3ff" />
                  <Text style={styles.contactText}>{personalInfo.phone}</Text>
                </View>
              )}
              {personalInfo.email && (
                <View style={styles.contactRow}>
                  <MaterialIcons name="email" size={18} color="#eef3ff" />
                  <Text style={styles.contactText}>{personalInfo.email}</Text>
                </View>
              )}
              {personalInfo.location && (
                <View style={styles.contactRow}>
                  <MaterialIcons name="location-on" size={18} color="#eef3ff" />
                  <Text style={styles.contactText}>
                    {personalInfo.location}
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarTitle}>Habilidades / Skills</Text>
              {skills.length > 0 ? (
                skills.map((skill) => (
                  <View key={skill.id} style={styles.skillCard}>
                    <Text style={styles.skillName}>{skill.name}</Text>
                    <Text style={styles.skillLevel}>{skill.level}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.emptySidebarText}>
                  Sin habilidades registradas.
                </Text>
              )}
            </View>

            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarTitle}>Educacion</Text>
              {education.length > 0 ? (
                education.map((edu) => (
                  <View key={edu.id} style={styles.educationItem}>
                    <Text style={styles.educationDegree}>• {edu.degree}</Text>
                    <Text style={styles.educationMeta}>{edu.institution}</Text>
                    {edu.field ? (
                      <Text style={styles.educationMeta}>{edu.field}</Text>
                    ) : null}
                    {edu.graduationYear ? (
                      <Text style={styles.educationMeta}>
                        {edu.graduationYear}
                      </Text>
                    ) : null}
                  </View>
                ))
              ) : (
                <Text style={styles.emptySidebarText}>
                  Sin educacion registrada.
                </Text>
              )}
            </View>
          </View>

          <View style={[styles.main, isNarrowScreen && styles.mainStacked]}>
            <View style={styles.mainHeader}>
              <Text style={styles.mainName}>
                {personalInfo.fullName || "Nombre"}
              </Text>
              <Text style={styles.mainRole}>{roleLabel}</Text>
            </View>

            <View style={styles.mainBody}>
              <View style={styles.mainSection}>
                <Text style={styles.mainTitle}>Acerca de mi / Profile</Text>
                <View style={styles.titleDivider} />
                <Text style={styles.summary}>
                  {personalInfo.summary ||
                    "Agrega un resumen profesional para destacar tu perfil y experiencia principal."}
                </Text>
              </View>

              <View style={styles.mainSection}>
                <Text style={styles.mainTitle}>Experiencia Laboral</Text>
                <View style={styles.titleDivider} />

                {experiences.length > 0 ? (
                  <View style={styles.timeline}>
                    {experiences.map((exp) => (
                      <View key={exp.id} style={styles.timelineItem}>
                        <View style={styles.timelineDot} />
                        <View style={styles.entry}>
                          <View style={styles.entryHeader}>
                            <Text style={styles.entryTitle}>
                              {exp.position}
                            </Text>
                            <Text style={styles.entryDate}>
                              {exp.startDate} - {exp.endDate || "Actual"}
                            </Text>
                          </View>
                          <Text style={styles.entryCompany}>{exp.company}</Text>
                          {exp.description ? (
                            <Text style={styles.entryDescription}>
                              {exp.description}
                            </Text>
                          ) : null}
                        </View>
                      </View>
                    ))}
                  </View>
                ) : (
                  <Text style={styles.emptyMainText}>
                    Sin experiencia registrada.
                  </Text>
                )}
              </View>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e6ebf2",
  },
  contentContainer: {
    paddingBottom: 20,
  },
  content: {
    padding: 14,
  },
  page: {
    flexDirection: "row",
    minHeight: 780,
    backgroundColor: "#fff",
    borderRadius: 20,
    overflow: "hidden",
  },
  pageStacked: {
    flexDirection: "column",
  },
  sidebar: {
    width: "36%",
    backgroundColor: "#3f72af",
    paddingVertical: 24,
    paddingHorizontal: 18,
  },
  sidebarStacked: {
    width: "100%",
  },
  main: {
    width: "64%",
    backgroundColor: "#fff",
  },
  mainStacked: {
    width: "100%",
  },
  profileWrap: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 5,
    borderColor: "rgba(255,255,255,0.85)",
  },
  profileFallback: {
    width: 150,
    height: 150,
    borderRadius: 75,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2c5689",
    borderWidth: 5,
    borderColor: "rgba(255,255,255,0.85)",
  },
  profileFallbackText: {
    color: "#fff",
    fontSize: 44,
    fontWeight: "800",
    letterSpacing: 1,
  },
  sidebarSection: {
    borderTopWidth: 2,
    borderTopColor: "rgba(255,255,255,0.55)",
    paddingTop: 14,
    marginTop: 12,
  },
  sidebarTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginBottom: 10,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    marginBottom: 10,
  },
  contactText: {
    color: "#eef3ff",
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
  skillCard: {
    backgroundColor: "rgba(20,48,84,0.18)",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.24)",
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginBottom: 8,
  },
  skillName: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 2,
  },
  skillLevel: {
    color: "#e3ebfb",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  educationItem: {
    marginBottom: 8,
  },
  educationDegree: {
    color: "#edf3ff",
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 20,
  },
  educationMeta: {
    color: "#e2eaf9",
    fontSize: 13,
    marginLeft: 14,
    lineHeight: 18,
  },
  emptySidebarText: {
    color: "#edf3ff",
    fontSize: 13,
    fontStyle: "italic",
  },
  mainHeader: {
    backgroundColor: "#1d4f8a",
    paddingVertical: 24,
    paddingHorizontal: 24,
  },
  mainName: {
    color: "#fff",
    fontSize: 38,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.3,
    lineHeight: 42,
  },
  mainRole: {
    color: "#d9e6f7",
    marginTop: 8,
    fontSize: 18,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  mainBody: {
    paddingVertical: 20,
    paddingHorizontal: 24,
  },
  mainSection: {
    marginBottom: 20,
  },
  mainTitle: {
    color: "#173f6d",
    fontSize: 16,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
  },
  titleDivider: {
    height: 2,
    backgroundColor: "#2e5d91",
    opacity: 0.75,
    marginBottom: 12,
  },
  summary: {
    color: "#2f455f",
    fontSize: 14,
    lineHeight: 22,
  },
  timeline: {
    borderLeftWidth: 3,
    borderLeftColor: "#2a5f95",
    paddingLeft: 16,
    marginLeft: 4,
  },
  timelineItem: {
    position: "relative",
    marginBottom: 12,
    paddingLeft: 4,
  },
  timelineDot: {
    position: "absolute",
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#1c4e83",
    left: -22,
    top: 8,
  },
  entry: {
    marginBottom: 2,
  },
  entryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    alignItems: "flex-start",
  },
  entryTitle: {
    color: "#133f71",
    fontSize: 18,
    fontWeight: "800",
    flex: 1,
  },
  entryDate: {
    color: "#274f7b",
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.7,
  },
  entryCompany: {
    color: "#2e5a85",
    fontSize: 15,
    fontWeight: "700",
    marginTop: 2,
    marginBottom: 2,
  },
  entryDescription: {
    color: "#2f4964",
    fontSize: 13,
    lineHeight: 20,
  },
  emptyMainText: {
    color: "#59718d",
    fontSize: 13,
    fontStyle: "italic",
  },
});
