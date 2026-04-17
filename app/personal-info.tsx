import React, { useEffect } from "react";
import { View, StyleSheet, Alert, ScrollView, Text, Image } from "react-native";
import { useRouter } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { InputField } from "../components/InputField";
import { NavigationButton } from "../components/NavigationButton";
import { useCVContext } from "../context/CVContext";
import { PersonalInfo } from "../types/cv.types";

export default function PersonalInfoScreen() {
  const router = useRouter();
  const { cvData, updatePersonalInfo } = useCVContext();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PersonalInfo>({ defaultValues: cvData.personalInfo });

  useEffect(() => {
    reset(cvData.personalInfo);
  }, [cvData.personalInfo]);

  const onSubmit = (data: PersonalInfo) => {
    updatePersonalInfo(data);
    Alert.alert("Éxito", "Información guardada correctamente", [
      { text: "OK", onPress: () => router.back() },
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
        <Text style={styles.bannerText}>Información Personal</Text>
        <Image
          source={require("../assets/images/buhoepn.png")}
          style={styles.bannerBuho}
          resizeMode="contain"
        />
      </View>
      <View style={styles.redStrip} />

      <View style={styles.content}>
        <Controller
          control={control}
          name="fullName"
          rules={{
            required: "El nombre completo es obligatorio",
            minLength: { value: 3, message: "Mínimo 3 caracteres" },
            pattern: {
              value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
              message: "Solo se permiten letras",
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <InputField
              label="Nombre Completo *"
              placeholder="Juan Pérez"
              value={value}
              onChangeText={(text) =>
                onChange(text.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, ""))
              }
              onBlur={onBlur}
              error={errors.fullName?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="email"
          rules={{
            required: "El email es obligatorio",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Ingresa un email válido",
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <InputField
              label="Email *"
              placeholder="juan@epn.edu.ec"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="phone"
          rules={{
            pattern: {
              value: /^[+]?[\d\s\-()]{7,15}$/,
              message: "Formato inválido. Ej: +593 99 999 9999",
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <InputField
              label="Teléfono"
              placeholder="+593 99 999 9999"
              value={value}
              onChangeText={(text) =>
                onChange(text.replace(/[^\d\s\-()+]/g, ""))
              }
              onBlur={onBlur}
              keyboardType="phone-pad"
              error={errors.phone?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="location"
          render={({ field: { onChange, onBlur, value } }) => (
            <InputField
              label="Ubicación"
              placeholder="Quito, Ecuador"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
            />
          )}
        />

        <Controller
          control={control}
          name="summary"
          rules={{
            maxLength: { value: 500, message: "Máximo 500 caracteres" },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <InputField
              label="Resumen Profesional"
              placeholder="Breve descripción de tu perfil..."
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              multiline
              numberOfLines={4}
              style={{ height: 100, textAlignVertical: "top" }}
              error={errors.summary?.message}
            />
          )}
        />

        <NavigationButton title="Guardar Información" onPress={handleSubmit(onSubmit)} />
        <NavigationButton title="Cancelar" onPress={() => router.back()} variant="secondary" />
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
});