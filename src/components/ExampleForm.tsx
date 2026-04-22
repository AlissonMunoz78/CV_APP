import { useForm } from "@tanstack/react-form";
import React from "react";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

type FormData = {
  nombre: string;
  email: string;
};

export default function ExampleForm() {
  const form = useForm<FormData>({
    defaultValues: {
      nombre: "",
      email: "",
    },
    onSubmit: async ({ value }) => {
      console.log("Formulario enviado:", value);
      alert("Formulario enviado correctamente");
      form.reset();
    },
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Formulario de Ejemplo</Text>

        <View style={styles.field}>
          <Text style={styles.label}>Nombre</Text>
          <form.Field
            name="nombre"
            validators={{
              onSubmit: ({ value }) => {
                if (!value || value.trim().length < 2)
                  return "Minimo 2 caracteres";
                return undefined;
              },
            }}
          >
            {(field) => (
              <>
                <TextInput
                  style={[
                    styles.input,
                    field.state.meta.errors[0] && styles.inputError,
                  ]}
                  onBlur={field.handleBlur}
                  onChangeText={field.handleChange}
                  value={field.state.value}
                  placeholder="Ingresa tu nombre"
                />
                {!!field.state.meta.errors[0] && (
                  <Text style={styles.error}>{field.state.meta.errors[0]}</Text>
                )}
              </>
            )}
          </form.Field>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Email</Text>
          <form.Field
            name="email"
            validators={{
              onSubmit: ({ value }) => {
                if (!value) return "El email es obligatorio";
                if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value))
                  return "Email invalido";
                return undefined;
              },
            }}
          >
            {(field) => (
              <>
                <TextInput
                  style={[
                    styles.input,
                    field.state.meta.errors[0] && styles.inputError,
                  ]}
                  onBlur={field.handleBlur}
                  onChangeText={field.handleChange}
                  value={field.state.value}
                  placeholder="correo@ejemplo.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                {!!field.state.meta.errors[0] && (
                  <Text style={styles.error}>{field.state.meta.errors[0]}</Text>
                )}
              </>
            )}
          </form.Field>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => form.handleSubmit()}
        >
          <Text style={styles.buttonText}>Enviar</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scrollContent: { padding: 20, paddingTop: 50 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
  },
  field: { marginBottom: 16 },
  label: { fontSize: 16, fontWeight: "600", marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  inputError: { borderColor: "#e74c3c" },
  error: { color: "#e74c3c", fontSize: 12, marginTop: 4 },
  button: {
    backgroundColor: "#3498db",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
