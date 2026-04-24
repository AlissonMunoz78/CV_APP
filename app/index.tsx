import { MaterialIcons } from "@expo/vector-icons";
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
  const hasPhoto = !!cvData.personalInfo.profileImage;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>CV Creator EPN</Text>
        <View style={styles.bannerRow}>
          <Image
            source={require("../assets/images/sello.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <View style={styles.bannerTextContainer}>
            <Text style={styles.bannerTitle}>CV Creator</Text>
            <Text style={styles.bannerSubtitle}>
              Escuela Politécnica Nacional
            </Text>
          </View>
          <Image
            source={require("../assets/images/buhoepn.png")}
            style={styles.buho}
            resizeMode="contain"
          />
        </View>
      </View>
      <View style={styles.redStrip} />

      <Text style={styles.title}>Crea tu CV Profesional</Text>

      <View style={styles.section}>
        <View style={styles.sectionTop}>
          <View style={styles.sectionTitleRow}>
            <View style={styles.sectionAccent} />
            <Text style={styles.sectionTitle}>Foto de Perfil</Text>
          </View>
          <Text
            style={[
              styles.statusText,
              hasPhoto ? styles.statusComplete : styles.statusPending,
            ]}
          >
            {hasPhoto ? "✓ Cargada" : "● Opcional"}
          </Text>
        </View>
        <View style={styles.photoRow}>
          <View style={styles.photoPreviewWrap}>
            {hasPhoto && cvData.personalInfo.profileImage ? (
              <Image
                source={{ uri: cvData.personalInfo.profileImage }}
                style={styles.photoPreview}
              />
            ) : (
              <View style={styles.photoPlaceholder}>
                <MaterialIcons name="person" size={28} color="#95a5a6" />
              </View>
            )}
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("/photo")}
          >
            <Text style={styles.buttonText}>
              {hasPhoto ? "Cambiar Foto" : "Subir Foto"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionTop}>
          <View style={styles.sectionTitleRow}>
            <View style={styles.sectionAccent} />
            <Text style={styles.sectionTitle}>1. Información Personal</Text>
          </View>
          <Text
            style={[
              styles.statusText,
              isPersonalInfoComplete
                ? styles.statusComplete
                : styles.statusPending,
            ]}
          >
            {isPersonalInfoComplete ? "✓ Completado" : "● Pendiente"}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/personal-info")}
        >
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionTop}>
          <View style={styles.sectionTitleRow}>
            <View style={styles.sectionAccent} />
            <Text style={styles.sectionTitle}>2. Experiencia Laboral</Text>
          </View>
          <Text
            style={[
              styles.statusText,
              hasExperience ? styles.statusComplete : styles.statusPending,
            ]}
          >
            {hasExperience
              ? `✓ ${cvData.experiences.length} agregada(s)`
              : "● Pendiente"}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/experience")}
        >
          <Text style={styles.buttonText}>Agregar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionTop}>
          <View style={styles.sectionTitleRow}>
            <View style={styles.sectionAccent} />
            <Text style={styles.sectionTitle}>3. Educación</Text>
          </View>
          <Text
            style={[
              styles.statusText,
              hasEducation ? styles.statusComplete : styles.statusPending,
            ]}
          >
            {hasEducation
              ? `✓ ${cvData.education.length} agregada(s)`
              : "● Pendiente"}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/education")}
        >
          <Text style={styles.buttonText}>Agregar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionTop}>
          <View style={styles.sectionTitleRow}>
            <View style={styles.sectionAccent} />
            <Text style={styles.sectionTitle}>4. Habilidades</Text>
          </View>
          <Text
            style={[
              styles.statusText,
              hasSkills ? styles.statusComplete : styles.statusPending,
            ]}
          >
            {hasSkills
              ? `✓ ${cvData.skills.length} agregada(s)`
              : "● Pendiente"}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/skills")}
        >
          <Text style={styles.buttonText}>Agregar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.previewContainer}>
        <TouchableOpacity
          style={styles.previewButton}
          onPress={() => router.push("/preview")}
        >
          <MaterialIcons name="visibility" size={22} color="#fff" />
          <Text style={styles.previewButtonText}>Ver Vista Previa del CV</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4fa",
  },
  contentContainer: {
    paddingBottom: 24,
  },
  header: {
    backgroundColor: "#0a2d6e",
    paddingTop: 14,
    paddingBottom: 10,
    paddingHorizontal: 16,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 14,
  },
  bannerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  logo: { width: 44, height: 44 },
  buho: { width: 42, height: 42 },
  bannerTextContainer: { flex: 1 },
  bannerTitle: { color: "#fff", fontSize: 18, fontWeight: "800" },
  bannerSubtitle: { color: "#a8c4f0", fontSize: 12, marginTop: 2 },
  redStrip: { height: 4, backgroundColor: "#c8102e" },
  title: {
    fontSize: 24,
    fontWeight: "800",
    marginHorizontal: 20,
    marginVertical: 18,
    color: "#0a2d6e",
  },
  section: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: "#0a2d6e",
  },
  sectionTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0a2d6e",
  },
  sectionAccent: {
    width: 3,
    height: 18,
    backgroundColor: "#c8102e",
    borderRadius: 2,
    marginRight: 10,
  },
  statusText: {
    fontSize: 13,
    fontWeight: "500",
  },
  statusComplete: {
    color: "#27ae60",
  },
  statusPending: {
    color: "#95a5a6",
  },
  button: {
    backgroundColor: "#0a2d6e",
    paddingVertical: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "700",
  },
  previewContainer: {
    marginHorizontal: 20,
    marginTop: 4,
    marginBottom: 8,
  },
  photoRow: {
    gap: 12,
  },
  photoPreviewWrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  photoPreview: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
    borderColor: "#0a2d6e",
  },
  photoPlaceholder: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
    borderColor: "#d1d5db",
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
  },
  previewButton: {
    backgroundColor: "#c8102e",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  previewButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
    textAlign: "center",
  },
});
