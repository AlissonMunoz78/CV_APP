import { useForm } from "@tanstack/react-form";
import { useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { DatePickerField } from "../components/DatePickerField";
import { InputField } from "../components/InputField";
import { NavigationButton } from "../components/NavigationButton";
import { useCVContext } from "../context/CVContext";
import { Education } from "../types/cv.types";

// PUNTO 3: Educacion usa TanStack Form (sin React Hook Form) y valida campos obligatorios.

export default function EducationScreen() {
  const router = useRouter();
  const { cvData, addEducation, deleteEducation } = useCVContext();

  const form = useForm({
    defaultValues: {
      institution: "",
      degree: "",
      field: "",
      graduationYear: "",
    },
    onSubmit: async ({ value }) => {
      addEducation({
        id: Date.now().toString(),
        ...(value as Omit<Education, "id">),
      });
      form.reset();
      Alert.alert("Exito", "Educacion agregada correctamente");
    },
  });

  const handleDelete = (id: string) => {
    Alert.alert("Confirmar", "¿Eliminar esta educación?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: () => deleteEducation(id),
      },
    ]);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        style={styles.container}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.banner}>
          <Image
            source={require("../assets/images/sello.png")}
            style={styles.bannerLogo}
            resizeMode="contain"
          />
          <Text style={styles.bannerText}>Educación</Text>
          <Image
            source={require("../assets/images/buhoepn.png")}
            style={styles.bannerBuho}
            resizeMode="contain"
          />
        </View>
        <View style={styles.redStrip} />

        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Agregar Nueva Educación</Text>

          <form.Field
            name="institution"
            validators={{
              onSubmit: ({ value }) => {
                if (!value || !value.trim())
                  return "La institucion es obligatoria";
                return undefined;
              },
            }}
          >
            {(field) => (
              <InputField
                label="Institución *"
                placeholder="Universidad/Institución"
                value={field.state.value}
                onChangeText={(text) =>
                  field.handleChange(
                    text.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, ""),
                  )
                }
                onBlur={field.handleBlur}
                error={field.state.meta.errors[0]}
              />
            )}
          </form.Field>

          <form.Field
            name="degree"
            validators={{
              onSubmit: ({ value }) => {
                if (!value || !value.trim()) return "El titulo es obligatorio";
                return undefined;
              },
            }}
          >
            {(field) => (
              <InputField
                label="Título/Grado *"
                placeholder="Ej: Licenciatura, Maestría"
                value={field.state.value}
                onChangeText={(text) =>
                  field.handleChange(
                    text.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, ""),
                  )
                }
                onBlur={field.handleBlur}
                error={field.state.meta.errors[0]}
              />
            )}
          </form.Field>

          <form.Field name="field">
            {(field) => (
              <InputField
                label="Área de Estudio"
                placeholder="Ej: Ingeniería en Sistemas"
                value={field.state.value}
                onChangeText={(text) =>
                  field.handleChange(
                    text.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, ""),
                  )
                }
                onBlur={field.handleBlur}
              />
            )}
          </form.Field>

          <form.Field name="graduationYear">
            {(field) => (
              <DatePickerField
                label="Fecha de Graduación"
                value={field.state.value}
                onChange={field.handleChange}
                placeholder="Seleccionar fecha de graduación"
              />
            )}
          </form.Field>

          <NavigationButton
            title="Agregar Educación"
            onPress={() => form.handleSubmit()}
          />

          {cvData.education.length > 0 && (
            <>
              <Text style={styles.listTitle}>Educación Agregada</Text>
              {cvData.education.map((edu) => (
                <View key={edu.id} style={styles.card}>
                  <View style={styles.cardContent}>
                    <Text style={styles.cardTitle}>{edu.degree}</Text>
                    <Text style={styles.cardSubtitle}>{edu.field}</Text>
                    <Text style={styles.cardInstitution}>
                      {edu.institution}
                    </Text>
                    <Text style={styles.cardDate}>{edu.graduationYear}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDelete(edu.id)}
                  >
                    <Text style={styles.deleteButtonText}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </>
          )}

          <NavigationButton
            title="Volver"
            onPress={() => router.back()}
            variant="secondary"
            style={{ marginTop: 16 }}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0f4fa" },
  banner: {
    backgroundColor: "#0a2d6e",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
  },
  bannerLogo: { width: 40, height: 40 },
  bannerBuho: { width: 34, height: 34 },
  bannerText: { flex: 1, color: "#fff", fontSize: 16, fontWeight: "bold" },
  redStrip: { height: 4, backgroundColor: "#c8102e" },
  content: { padding: 20 },
  scrollContent: { paddingBottom: 32 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0a2d6e",
    marginBottom: 16,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0a2d6e",
    marginTop: 24,
    marginBottom: 12,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    borderLeftWidth: 4,
    borderLeftColor: "#0a2d6e",
    elevation: 2,
  },
  cardContent: { flex: 1 },
  cardTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#0a2d6e",
    marginBottom: 4,
  },
  cardSubtitle: { fontSize: 13, color: "#7f8c8d", marginBottom: 4 },
  cardInstitution: { fontSize: 13, color: "#95a5a6", marginBottom: 2 },
  cardDate: { fontSize: 12, color: "#95a5a6" },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#c8102e",
    justifyContent: "center",
    alignItems: "center",
  },
  deleteButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
