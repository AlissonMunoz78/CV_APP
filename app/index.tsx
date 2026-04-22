import { useRouter } from "expo-router";
import React from "react";
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useCVContext } from "../context/CVContext";

export default function HomeScreen() {
  const router = useRouter();
  const { cvData } = useCVContext();

  const isPersonalInfoComplete =
    cvData.personalInfo.fullName && cvData.personalInfo.email;
  const hasExperience = cvData.experiences.length > 0;
  const hasEducation = cvData.education.length > 0;
  const hasSkills = cvData.skills.length > 0;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("../assets/images/sello.png")}
          style={styles.sello}
          resizeMode="contain"
        />
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>CV Creator</Text>
          <Text style={styles.headerSub}>Escuela Politécnica Nacional</Text>
        </View>
        <Image
          source={require("../assets/images/buhoepn.png")}
          style={styles.buho}
          resizeMode="contain"
        />
      </View>
      <View style={styles.redStrip} />

      <View style={styles.content}>
        <Text style={styles.title}>Crea tu CV Profesional</Text>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionAccent} />
            <Text style={styles.sectionTitle}>1. Información Personal</Text>
          </View>
          <Text
            style={[
              styles.status,
              isPersonalInfoComplete
                ? styles.statusComplete
                : styles.statusPending,
            ]}
          >
            {isPersonalInfoComplete ? "✓ Completado" : "● Pendiente"}
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("/personal-info")}
          >
            <Text style={styles.buttonText}>Editar</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionAccent} />
            <Text style={styles.sectionTitle}>2. Experiencia Laboral</Text>
          </View>
          <Text
            style={[
              styles.status,
              hasExperience ? styles.statusComplete : styles.statusPending,
            ]}
          >
            {hasExperience
              ? `✓ ${cvData.experiences.length} agregada(s)`
              : "● Pendiente"}
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("/experience")}
          >
            <Text style={styles.buttonText}>Agregar</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionAccent} />
            <Text style={styles.sectionTitle}>3. Educación</Text>
          </View>
          <Text
            style={[
              styles.status,
              hasEducation ? styles.statusComplete : styles.statusPending,
            ]}
          >
            {hasEducation
              ? `✓ ${cvData.education.length} agregada(s)`
              : "● Pendiente"}
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("/education")}
          >
            <Text style={styles.buttonText}>Agregar</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionAccent} />
            <Text style={styles.sectionTitle}>4. Habilidades</Text>
          </View>
          <Text
            style={[
              styles.status,
              hasSkills ? styles.statusComplete : styles.statusPending,
            ]}
          >
            {hasSkills
              ? `✓ ${cvData.skills.length} agregada(s)`
              : "● Pendiente"}
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("/skills")}
          >
            <Text style={styles.buttonText}>Agregar</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.previewButton}
          onPress={() => router.push("/preview")}
        >
          <Text style={styles.previewButtonText}>
            👁 Ver Vista Previa del CV
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0f4fa" },
  header: {
    backgroundColor: "#0a2d6e",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
  },
  sello: { width: 48, height: 48 },
  buho: { width: 40, height: 40 },
  headerText: { flex: 1 },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  headerSub: { color: "#a8c4f0", fontSize: 11, marginTop: 2 },
  redStrip: { height: 4, backgroundColor: "#c8102e" },
  content: { padding: 20 },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0a2d6e",
    marginBottom: 20,
  },
  section: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 14,
    borderLeftWidth: 4,
    borderLeftColor: "#0a2d6e",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  sectionAccent: {
    width: 3,
    height: 16,
    backgroundColor: "#c8102e",
    borderRadius: 2,
  },
  sectionTitle: { fontSize: 16, fontWeight: "600", color: "#0a2d6e" },
  status: { fontSize: 13, marginBottom: 12, fontWeight: "500" },
  statusComplete: { color: "#27ae60" },
  statusPending: { color: "#95a5a6" },
  button: { backgroundColor: "#0a2d6e", padding: 12, borderRadius: 8 },
  buttonText: {
    color: "#fff",
    fontSize: 15,
    textAlign: "center",
    fontWeight: "600",
  },
  previewButton: {
    backgroundColor: "#c8102e",
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
    marginBottom: 30,
  },
  previewButtonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "bold",
  },
});
