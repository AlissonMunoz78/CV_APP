import { CVPreview } from "@/components/CVPreview";
import { NavigationButton } from "@/components/NavigationButton";
import { useCVContext } from "@/context/CVContext";
import {
    buildCvHtmlWithResolvedImage,
    generateAndShareCVPdf,
} from "@/src/utils/pdf";
import React, { useEffect, useState } from "react";
import { Alert, Modal, StyleSheet, Text, View } from "react-native";
import { WebView } from "react-native-webview";

export default function PreviewScreen() {
  const { cvData } = useCVContext();
  const [showHtmlPreview, setShowHtmlPreview] = useState(false);
  const [htmlPreview, setHtmlPreview] = useState("<html><body></body></html>");

  const getScaledPreviewHtml = (html: string) => {
    const previewScaleCss = `
      <style>
        @media screen {
          body {
            margin: 0;
            overflow: auto;
          }
          .page {
            transform: scale(0.74);
            transform-origin: top left;
            width: calc(100% / 0.74);
            margin-bottom: -300px;
          }
        }
      </style>
    `;

    if (html.includes("</head>")) {
      return html.replace("</head>", `${previewScaleCss}</head>`);
    }

    return `${previewScaleCss}${html}`;
  };

  useEffect(() => {
    let isMounted = true;

    (async () => {
      const html = await buildCvHtmlWithResolvedImage(cvData);
      if (isMounted) {
        setHtmlPreview(getScaledPreviewHtml(html));
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [cvData]);

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
  container: { flex: 1, backgroundColor: "#f0f4fa" },
  actions: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: "#f0f4fa",
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
