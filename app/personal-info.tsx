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
    View,
} from "react-native";
import { InputField } from "../components/InputField";
import { NavigationButton } from "../components/NavigationButton";
import { useCVContext } from "../context/CVContext";
import {
    sanitizeLocation,
    sanitizeName,
    sanitizePhone,
    validateEmail,
    validateFullName,
    validateLocation,
    validatePhone,
} from "../src/utils/formValidators";
import { PersonalInfo } from "../types/cv.types";

// PUNTO 3: Formularios migrados a TanStack Form con validaciones en pantalla.

export default function PersonalInfoScreen() {
  const router = useRouter();
  const { cvData, updatePersonalInfo } = useCVContext();

  const form = useForm({
    defaultValues: cvData.personalInfo,
    onSubmit: async ({ value }) => {
      updatePersonalInfo(value as PersonalInfo);
      Alert.alert("Exito", "Informacion guardada correctamente", [
        { text: "OK", onPress: () => router.back() },
      ]);
    },
  });

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
          <Text style={styles.bannerText}>Información Personal</Text>
          <Image
            source={require("../assets/images/buhoepn.png")}
            style={styles.bannerBuho}
            resizeMode="contain"
          />
        </View>
        <View style={styles.redStrip} />

        <View style={styles.content}>
          <form.Field
            name="fullName"
            validators={{
              onSubmit: ({ value }) => validateFullName(value),
            }}
          >
            {(field) => (
              <InputField
                label="Nombre Completo *"
                placeholder="Juan Perez"
                value={field.state.value}
                onChangeText={(text) => field.handleChange(sanitizeName(text))}
                onBlur={field.handleBlur}
                error={field.state.meta.errors[0]}
              />
            )}
          </form.Field>

          <form.Field
            name="email"
            validators={{
              onSubmit: ({ value }) => validateEmail(value),
            }}
          >
            {(field) => (
              <InputField
                label="Email *"
                placeholder="juan@epn.edu.ec"
                value={field.state.value}
                onChangeText={field.handleChange}
                onBlur={field.handleBlur}
                keyboardType="email-address"
                autoCapitalize="none"
                error={field.state.meta.errors[0]}
              />
            )}
          </form.Field>

          <form.Field
            name="phone"
            validators={{
              onSubmit: ({ value }) => validatePhone(value),
            }}
          >
            {(field) => (
              <InputField
                label="Telefono"
                placeholder="+593 99 999 9999"
                value={field.state.value}
                onChangeText={(text) => field.handleChange(sanitizePhone(text))}
                onBlur={field.handleBlur}
                keyboardType="phone-pad"
                error={field.state.meta.errors[0]}
              />
            )}
          </form.Field>

          <form.Field
            name="location"
            validators={{
              onSubmit: ({ value }) => validateLocation(value),
            }}
          >
            {(field) => (
              <InputField
                label="Ubicacion *"
                placeholder="Quito, Ecuador"
                value={field.state.value}
                onChangeText={(text) =>
                  field.handleChange(sanitizeLocation(text))
                }
                onBlur={field.handleBlur}
                error={field.state.meta.errors[0]}
              />
            )}
          </form.Field>

          <form.Field
            name="summary"
            validators={{
              onSubmit: ({ value }) => {
                if (value && value.length > 500) return "Maximo 500 caracteres";
                return undefined;
              },
            }}
          >
            {(field) => (
              <InputField
                label="Resumen Profesional"
                placeholder="Breve descripcion de tu perfil..."
                value={field.state.value}
                onChangeText={field.handleChange}
                onBlur={field.handleBlur}
                multiline
                numberOfLines={4}
                style={{ height: 100, textAlignVertical: "top" }}
                error={field.state.meta.errors[0]}
              />
            )}
          </form.Field>

          <NavigationButton
            title="Guardar Informacion"
            onPress={() => form.handleSubmit()}
          />
          <NavigationButton
            title="Cancelar"
            onPress={() => router.back()}
            variant="secondary"
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
});
