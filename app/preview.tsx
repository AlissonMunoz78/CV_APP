import React, { useMemo, useState } from "react";
import { Alert, Modal, StyleSheet, Text, View } from "react-native";
import { WebView } from "react-native-webview";
import { CVPreview } from "../components/CVPreview";
import { NavigationButton } from "../components/NavigationButton";
import { useCVContext } from "../context/CVContext";
import { buildCvHtml, generateAndShareCVPdf } from "../src/utils/pdf";

export default function PreviewScreen() {
  const { cvData } = useCVContext();
  const [showHtmlPreview, setShowHtmlPreview] = useState(false);
  const htmlPreview = useMemo(() => buildCvHtml(cvData), [cvData]);

  const handleSharePdf = async () => {
    try {
      await generateAndShareCVPdf(cvData);
    } catch {
      Alert.alert("Error", "No se pudo generar o compartir el PDF");
    }
  };

  return (
    <View style={styles.container}>
      <CVPreview cvData={cvData} />
      <View style={styles.actions}>
        {/* PUNTO 2: Vista previa visual del HTML que se exporta a PDF. */}
        <NavigationButton
          title="Ver HTML del PDF"
          onPress={() => setShowHtmlPreview(true)}
          variant="secondary"
        />
        {/* PUNTO 2: Boton para compartir PDF por apps (email, redes, etc). */}
        <NavigationButton
          title="Compartir CV en PDF"
          onPress={handleSharePdf}
        />
      </View>

      <Modal
        visible={showHtmlPreview}
        animationType="slide"
        onRequestClose={() => setShowHtmlPreview(false)}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Vista previa HTML del PDF</Text>
          <View style={styles.htmlContainer}>
            <WebView
              originWhitelist={["*"]}
              source={{ html: htmlPreview }}
              style={styles.webview}
            />
          </View>
          <NavigationButton
            title="Cerrar vista previa"
            onPress={() => setShowHtmlPreview(false)}
          />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  actions: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: "#fff",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#f8fafc",
    paddingHorizontal: 16,
    paddingTop: 36,
    paddingBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0a2d6e",
    marginBottom: 12,
  },
  htmlContainer: {
    flex: 1,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 12,
  },
  webview: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
