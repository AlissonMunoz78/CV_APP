import React, { useState } from "react";
import {
  View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, Image,
} from "react-native";
import { useRouter } from "expo-router";
import { InputField } from "../components/InputField";
import { DatePickerField } from "../components/DatePickerField";
import { NavigationButton } from "../components/NavigationButton";
import { useCVContext } from "../context/CVContext";
import { Education } from "../types/cv.types";

export default function EducationScreen() {
  const router = useRouter();
  const { cvData, addEducation, deleteEducation } = useCVContext();

  const [formData, setFormData] = useState<Omit<Education, "id">>({
    institution: "", degree: "", field: "", graduationYear: "",
  });

  const handleAdd = () => {
    if (!formData.institution || !formData.degree) {
      Alert.alert("Error", "Completa al menos institución y título");
      return;
    }
    addEducation({ id: Date.now().toString(), ...formData });
    setFormData({ institution: "", degree: "", field: "", graduationYear: "" });
    Alert.alert("Éxito", "Educación agregada correctamente");
  };

  const handleDelete = (id: string) => {
    Alert.alert("Confirmar", "¿Eliminar esta educación?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Eliminar", style: "destructive", onPress: () => deleteEducation(id) },
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

        <InputField
          label="Institución *"
          placeholder="Universidad/Institución"
          value={formData.institution}
          onChangeText={(text) =>
            setFormData({ ...formData, institution: text.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "") })
          }
        />

        <InputField
          label="Título/Grado *"
          placeholder="Ej: Licenciatura, Maestría"
          value={formData.degree}
          onChangeText={(text) =>
            setFormData({ ...formData, degree: text.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "") })
          }
        />

        <InputField
          label="Área de Estudio"
          placeholder="Ej: Ingeniería en Sistemas"
          value={formData.field}
          onChangeText={(text) =>
            setFormData({ ...formData, field: text.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "") })
          }
        />

        <DatePickerField
          label="Fecha de Graduación"
          value={formData.graduationYear}
          onChange={(date) => setFormData({ ...formData, graduationYear: date })}
          placeholder="Seleccionar fecha de graduación"
        />

        <NavigationButton title="Agregar Educación" onPress={handleAdd} />

        {cvData.education.length > 0 && (
          <>
            <Text style={styles.listTitle}>Educación Agregada</Text>
            {cvData.education.map((edu) => (
              <View key={edu.id} style={styles.card}>
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{edu.degree}</Text>
                  <Text style={styles.cardSubtitle}>{edu.field}</Text>
                  <Text style={styles.cardInstitution}>{edu.institution}</Text>
                  <Text style={styles.cardDate}>{edu.graduationYear}</Text>
                </View>
                <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(edu.id)}>
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
    borderLeftColor: "#0a2d6e",
    elevation: 2,
  },
  cardContent: { flex: 1 },
  cardTitle: { fontSize: 15, fontWeight: "600", color: "#0a2d6e", marginBottom: 4 },
  cardSubtitle: { fontSize: 13, color: "#7f8c8d", marginBottom: 4 },
  cardInstitution: { fontSize: 13, color: "#95a5a6", marginBottom: 2 },
  cardDate: { fontSize: 12, color: "#95a5a6" },
  deleteButton: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: "#c8102e", justifyContent: "center", alignItems: "center",
  },
  deleteButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});