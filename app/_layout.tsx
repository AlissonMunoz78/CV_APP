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
          options={{ title: "Información Personal" }}
        />
        <Stack.Screen
          name="experience"
          options={{ title: "Experiencia Laboral" }}
        />
        <Stack.Screen name="education" options={{ title: "Educación" }} />
        <Stack.Screen name="skills" options={{ title: "Habilidades" }} />
        <Stack.Screen
          name="preview"
          options={{ title: "Vista Previa CV", presentation: "modal" }}
        />
      </Stack>
    </CVProvider>
  );
}
