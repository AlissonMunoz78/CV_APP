import React, { useState } from "react";
import {
  View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, Image,
} from "react-native";
import { useRouter } from "expo-router";
import { InputField } from "../components/InputField";
import { DatePickerField } from "../components/DatePickerField";
import { NavigationButton } from "../components/NavigationButton";
import { useCVContext } from "../context/CVContext";
import { Experience } from "../types/cv.types";

export default function ExperienceScreen() {
  const router = useRouter();
  const { cvData, addExperience, deleteExperience } = useCVContext();

  const [formData, setFormData] = useState<Omit<Experience, "id">>({
    company: "", position: "", startDate: "", endDate: "", description: "",
  });
  const [isCurrentJob, setIsCurrentJob] = useState(false);

  const handleAdd = () => {
    if (!formData.company || !formData.position || !formData.startDate) {
      Alert.alert("Error", "Completa al menos empresa, cargo y fecha de inicio");
      return;
    }
    addExperience({
      id: Date.now().toString(),
      ...formData,
      endDate: isCurrentJob ? "Actual" : formData.endDate,
    });
    setFormData({ company: "", position: "", startDate: "", endDate: "", description: "" });
    setIsCurrentJob(false);
    Alert.alert("Éxito", "Experiencia agregada correctamente");
  };

  const handleDelete = (id: string) => {
    Alert.alert("Confirmar", "¿Eliminar esta experiencia?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Eliminar", style: "destructive", onPress: () => deleteExperience(id) },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.banner}>
        <Image
          source={require("../assets/images/sello.png")}
          style={styles.bannerLogo}
          resizeMode="contain"
        />
        <Text style={styles.bannerText}>Experiencia Laboral</Text>
        <Image
          source={require("../assets/images/buhoepn.png")}
          style={styles.bannerBuho}
          resizeMode="contain"
        />
      </View>
      <View style={styles.redStrip} />

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Agregar Nueva Experiencia</Text>

        <InputField
          label="Empresa *"
          placeholder="Nombre de la empresa"
          value={formData.company}
          onChangeText={(text) =>
            setFormData({ ...formData, company: text.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]/g, "") })
          }
        />

        <InputField
          label="Cargo *"
          placeholder="Tu posición"
          value={formData.position}
          onChangeText={(text) =>
            setFormData({ ...formData, position: text.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "") })
          }
        />

        <DatePickerField
          label="Fecha de Inicio *"
          value={formData.startDate}
          onChange={(date) => setFormData({ ...formData, startDate: date })}
        />

        <TouchableOpacity
          style={styles.checkboxRow}
          onPress={() => {
            setIsCurrentJob(!isCurrentJob);
            if (!isCurrentJob) setFormData({ ...formData, endDate: "" });
          }}
        >
          <View style={[styles.checkbox, isCurrentJob && styles.checkboxChecked]}>
            {isCurrentJob && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={styles.checkboxLabel}>Trabajo actual</Text>
        </TouchableOpacity>

        <DatePickerField
          label="Fecha de Fin"
          value={formData.endDate}
          onChange={(date) => setFormData({ ...formData, endDate: date })}
          disabled={isCurrentJob}
        />

        <InputField
          label="Descripción"
          placeholder="Describe tus responsabilidades..."
          value={formData.description}
          onChangeText={(text) => setFormData({ ...formData, description: text })}
          multiline
          numberOfLines={4}
          style={{ height: 100, textAlignVertical: "top" }}
        />

        <NavigationButton title="Agregar Experiencia" onPress={handleAdd} />

        {cvData.experiences.length > 0 && (
          <>
            <Text style={styles.listTitle}>Experiencias Agregadas</Text>
            {cvData.experiences.map((exp) => (
              <View key={exp.id} style={styles.card}>
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{exp.position}</Text>
                  <Text style={styles.cardSubtitle}>{exp.company}</Text>
                  <Text style={styles.cardDate}>
                    {exp.startDate} - {exp.endDate || "Actual"}
                  </Text>
                </View>
                <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(exp.id)}>
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
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#0a2d6e", marginBottom: 16 },
  listTitle: { fontSize: 16, fontWeight: "600", color: "#0a2d6e", marginTop: 24, marginBottom: 12 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    borderLeftWidth: 4,
    borderLeftColor: "#c8102e",
    elevation: 2,
  },
  cardContent: { flex: 1 },
  cardTitle: { fontSize: 15, fontWeight: "600", color: "#0a2d6e", marginBottom: 4 },
  cardSubtitle: { fontSize: 13, color: "#7f8c8d", marginBottom: 4 },
  cardDate: { fontSize: 12, color: "#95a5a6" },
  deleteButton: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: "#c8102e", justifyContent: "center", alignItems: "center",
  },
  deleteButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  checkboxRow: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  checkbox: {
    width: 22, height: 22, borderWidth: 2,
    borderColor: "#0a2d6e", borderRadius: 4,
    marginRight: 10, justifyContent: "center", alignItems: "center",
  },
  checkboxChecked: { backgroundColor: "#0a2d6e" },
  checkmark: { color: "#fff", fontSize: 14, fontWeight: "bold" },
  checkboxLabel: { fontSize: 15, color: "#333" },
});