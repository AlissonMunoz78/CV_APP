import { Stack } from "expo-router";
import { CVProvider } from "../context/CVContext";

export default function RootLayout() {
  return (
    <CVProvider>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "#0a2d6e" },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "bold" },
        }}
      >
        <Stack.Screen
          name="index"
          options={{ title: "CV Creator EPN", headerShown: true }}
        />
        <Stack.Screen
          name="personal-info"
          options={{ title: "Informaci3n Personal" }}
        />
        <Stack.Screen
          name="experience"
          options={{ title: "Experiencia Laboral" }}
        />
        <Stack.Screen name="education" options={{ title: "Educaci3n" }} />
        <Stack.Screen name="skills" options={{ title: "Habilidades" }} />
        <Stack.Screen name="photo" options={{ title: "Foto de Perfil" }} />
        <Stack.Screen
          name="preview"
          options={{ title: "Vista Previa CV", presentation: "modal" }}
        />
      </Stack>
    </CVProvider>
  );
}
