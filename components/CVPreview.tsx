import React from "react";
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import { CVData } from "../types/cv.types";

interface CVPreviewProps {
  cvData: CVData;
}

export const CVPreview: React.FC<CVPreviewProps> = ({ cvData }) => {
  const { personalInfo, experiences, education } = cvData;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.epnHeader}>
        <Image
          source={require("../assets/images/sello.png")}
          style={styles.sello}
          resizeMode="contain"
        />
        <View style={styles.epnHeaderText}>
          <Text style={styles.epnTitle}>Escuela Politécnica Nacional</Text>
          <Text style={styles.epnSub}>Currículum Vitae</Text>
        </View>
        <Image
          source={require("../assets/images/buhoepn.png")}
          style={styles.buho}
          resizeMode="contain"
        />
      </View>
      <View style={styles.redStrip} />

      <View style={styles.content}>
        <View style={styles.nameSection}>
          <Text style={styles.name}>{personalInfo.fullName || "Tu Nombre"}</Text>
          <View style={styles.contactRow}>
            {personalInfo.email && <Text style={styles.contactText}>📧 {personalInfo.email}</Text>}
            {personalInfo.phone && <Text style={styles.contactText}>📱 {personalInfo.phone}</Text>}
            {personalInfo.location && <Text style={styles.contactText}>📍 {personalInfo.location}</Text>}
          </View>
        </View>

        {personalInfo.summary && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionAccent} />
              <Text style={styles.sectionTitle}>RESUMEN PROFESIONAL</Text>
            </View>
            <Text style={styles.summaryText}>{personalInfo.summary}</Text>
          </View>
        )}

        {experiences.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionAccent} />
              <Text style={styles.sectionTitle}>EXPERIENCIA LABORAL</Text>
            </View>
            {experiences.map((exp) => (
              <View key={exp.id} style={styles.item}>
                <Text style={styles.itemTitle}>{exp.position}</Text>
                <Text style={styles.itemSubtitle}>{exp.company}</Text>
                <Text style={styles.itemDate}>{exp.startDate} - {exp.endDate || "Actual"}</Text>
                {exp.description && <Text style={styles.itemDescription}>{exp.description}</Text>}
              </View>
            ))}
          </View>
        )}

        {education.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionAccent} />
              <Text style={styles.sectionTitle}>EDUCACIÓN</Text>
            </View>
            {education.map((edu) => (
              <View key={edu.id} style={styles.item}>
                <Text style={styles.itemTitle}>{edu.degree}</Text>
                {edu.field && <Text style={styles.itemSubtitle}>{edu.field}</Text>}
                <Text style={styles.itemInstitution}>{edu.institution}</Text>
                {edu.graduationYear && <Text style={styles.itemDate}>{edu.graduationYear}</Text>}
              </View>
            ))}
          </View>
        )}

        {!personalInfo.fullName && experiences.length === 0 && education.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              No hay información para mostrar.{"\n"}Completa las secciones para ver tu CV.
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default CVPreview;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  epnHeader: {
    backgroundColor: "#0a2d6e",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
  },
  sello: { width: 48, height: 48 },
  buho: { width: 40, height: 40 },
  epnHeaderText: { flex: 1 },
  epnTitle: { color: "#fff", fontSize: 14, fontWeight: "bold" },
  epnSub: { color: "#a8c4f0", fontSize: 11, marginTop: 2 },
  redStrip: { height: 4, backgroundColor: "#c8102e" },
  content: { padding: 20 },
  nameSection: {
    borderBottomWidth: 2,
    borderBottomColor: "#0a2d6e",
    paddingBottom: 16,
    marginBottom: 20,
  },
  name: { fontSize: 28, fontWeight: "bold", color: "#0a2d6e", marginBottom: 10 },
  contactRow: { gap: 4 },
  contactText: { fontSize: 13, color: "#7f8c8d", marginBottom: 3 },
  section: { marginBottom: 20 },
  sectionHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 },
  sectionAccent: { width: 3, height: 16, backgroundColor: "#c8102e", borderRadius: 2 },
  sectionTitle: { fontSize: 14, fontWeight: "bold", color: "#0a2d6e", letterSpacing: 1 },
  summaryText: { fontSize: 13, color: "#34495e", lineHeight: 20 },
  item: {
    marginBottom: 14,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#ecf0f1",
  },
  itemTitle: { fontSize: 15, fontWeight: "600", color: "#0a2d6e", marginBottom: 3 },
  itemSubtitle: { fontSize: 13, color: "#7f8c8d", marginBottom: 3 },
  itemInstitution: { fontSize: 13, color: "#95a5a6", marginBottom: 3 },
  itemDate: { fontSize: 12, color: "#c8102e", fontStyle: "italic", marginBottom: 6 },
  itemDescription: { fontSize: 13, color: "#34495e", lineHeight: 18 },
  emptyState: { flex: 1, justifyContent: "center", alignItems: "center", paddingVertical: 60 },
  emptyText: { fontSize: 15, color: "#95a5a6", textAlign: "center", lineHeight: 24 },
});