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
import { InputField } from "../components/InputField";
import { NavigationButton } from "../components/NavigationButton";
import { useCVContext } from "../context/CVContext";
import { SkillLevel } from "../types/cv.types";

// PUNTO 1: Pantalla de Skills con niveles (Basico, Intermedio, Avanzado, Experto).
const SKILL_LEVELS: SkillLevel[] = [
  "Básico",
  "Intermedio",
  "Avanzado",
  "Experto",
];

//PUNTO 3: Formularios migrados a TanStack Form con validaciones en pantalla
export default function SkillsScreen() {
  const router = useRouter();
  const { cvData, addSkill, deleteSkill } = useCVContext();

  const form = useForm({
    defaultValues: {
      name: "",
      level: "" as SkillLevel | "",
    },
    onSubmit: async ({ value }) => {
      addSkill({
        id: Date.now().toString(),
        name: value.name.trim(),
        level: value.level as SkillLevel,
      });

      form.reset();
      Alert.alert("Exito", "Habilidad agregada correctamente");
    },
  });

  const handleDelete = (id: string) => {
    Alert.alert("Confirmar", "¿Eliminar esta habilidad?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: () => deleteSkill(id),
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
          <Text style={styles.bannerText}>Habilidades Tecnicas</Text>
          <Image
            source={require("../assets/images/buhoepn.png")}
            style={styles.bannerBuho}
            resizeMode="contain"
          />
        </View>
        <View style={styles.redStrip} />

        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Agregar Nueva Habilidad</Text> {

/*PUNTO 4: TanStack Form permite manejar mejor la lógica y validación de los formularios, siendo más flexible y útil en proyectos grandes.
React Hook Form es más sencillo y rápido de usar, ideal para formularios básicos.
Usa TanStack Form cuando quieras logica de formularios compartible y tipado fuerte entre plataformas;
usa React Hook Form cuando priorizas simplicidad y minimo rerender en formularios tradicionales del DOM.*/

            } <form.Field
            name="name"
            validators={{

              onSubmit: ({ value }) => {
                if (!value || !value.trim()) return "El nombre es obligatorio";
                return undefined;
              },
            }}
          >
            {(field) => (
              <InputField
                label="Nombre de la habilidad *"
                placeholder="Ej: React Native"
                value={field.state.value}
                onChangeText={(text) =>
                  field.handleChange(text.replace(/[^a-zA-Z0-9+#.\s-]/g, ""))
                }
                onBlur={field.handleBlur}
                error={field.state.meta.errors[0]}
              />
            )}
          </form.Field>

          <form.Field
            name="level"
            validators={{
              onSubmit: ({ value }) => {
                if (!value) return "El nivel es obligatorio";
                return undefined;
              },
            }}
          >
            {(field) => (
              <View style={styles.levelContainer}>
                <Text style={styles.levelLabel}>Nivel *</Text>
                <View style={styles.levelGrid}>
                  {SKILL_LEVELS.map((levelOption) => {
                    const selected = field.state.value === levelOption;
                    return (
                      <TouchableOpacity
                        key={levelOption}
                        style={[
                          styles.levelButton,
                          selected && styles.levelButtonSelected,
                        ]}
                        onPress={() => field.handleChange(levelOption)}
                      >
                        <Text
                          style={[
                            styles.levelButtonText,
                            selected && styles.levelButtonTextSelected,
                          ]}
                        >
                          {levelOption}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
                {!!field.state.meta.errors[0] && (
                  <Text style={styles.errorText}>
                    {field.state.meta.errors[0]}
                  </Text>
                )}
              </View>
            )}
          </form.Field>

          <NavigationButton
            title="Agregar Habilidad"
            onPress={() => form.handleSubmit()}
          />

          {cvData.skills.length > 0 && (
            <>
              <Text style={styles.listTitle}>Habilidades Agregadas</Text>
              {cvData.skills.map((skill) => (
                <View key={skill.id} style={styles.card}>
                  <View style={styles.cardContent}>
                    <Text style={styles.cardTitle}>{skill.name}</Text>
                    <Text style={styles.cardSubtitle}>
                      Nivel: {skill.level}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDelete(skill.id)}
                  >
                    <Text style={styles.deleteButtonText}>X</Text>
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
  levelContainer: { marginBottom: 16 },
  levelLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  levelGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  levelButton: {
    borderWidth: 1,
    borderColor: "#0a2d6e",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
  },
  levelButtonSelected: {
    backgroundColor: "#0a2d6e",
  },
  levelButtonText: {
    color: "#0a2d6e",
    fontWeight: "600",
  },
  levelButtonTextSelected: {
    color: "#fff",
  },
  errorText: {
    color: "#ff4d4d",
    fontSize: 14,
    marginTop: 4,
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
